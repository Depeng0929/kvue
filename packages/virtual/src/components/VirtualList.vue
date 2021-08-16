<template>
  <div
    v-observe-visibility="{callback:onVisibilityChange}"
    class="virtual-list"
    @scroll.passive="onScroll"
  >
    <div class="virtual-wrap" :style="{height: totalSize + 'px'}">
      <div
        v-for="listItem in pool"
        :key="listItem.item.id"
        class="virtual-item"
        :style="{
          transform:`translateY(${listItem.acc - listItem.item.h}px)`,
        }"
      >
        <slot :item="listItem.item"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  PropType,
  toRefs,
  nextTick,
  onMounted,
  getCurrentInstance,
  onBeforeUnmount,
  computed,
  watch,
  defineComponent,
} from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { ObserveVisibility } from '@depeng9527/visible'
import ScrollParent from 'scrollparent'
import { ListItemWithHeght, ListExtraInfo, ListItemExtraInfo } from '../types'
import { ITEM_MIN_HEIGHT } from '../config'
import { props as commProps } from './comm'

interface ListPool extends ListItemExtraInfo {
  item: ListItemWithHeght
}

let uid = -9999
export default defineComponent({
  name: 'VirtualList',

  directives: {
    ObserveVisibility,
  },

  props: {
    ...commProps,

    items: {
      type: Array as PropType<ListItemWithHeght[]>,
      required: true,
    },
  },

  setup(props) {
    let min = ITEM_MIN_HEIGHT
    let lastPosition = 0

    const pool = ref<ListPool[]>([])
    const totalSize = ref(0)
    const instance = getCurrentInstance()

    const { items, buffer } = toRefs(props)

    const sizes = computed(() => {
      const result: ListExtraInfo = {
        '-1': { acc: 0, size: 0 },
      }
      let acc = 0

      let current
      for (let i = 0, l = items.value.length; i < l; i++) {
        current = items.value[i].h || 54
        if (current < min)
          min = current

        acc += current
        result[i] = { acc, size: current }
      }

      return result
    })

    watch([items, sizes], () => {
      updateVisibleItems({ checkPosition: false })
    }, { deep: true })

    onMounted(() => {
      addListeners()
      nextTick(() => {
        updateVisibleItems({ checkPosition: false })
      })
    })

    onBeforeUnmount(() => {
      removeListeners()
    })

    function updateVisibleItems({ checkPosition = false }) {
      let startIndex, endIndex
      const count = items.value.length
      totalSize.value = sizes.value[count - 1].acc

      if (!count) {
        startIndex = endIndex = 0
      }
      else {
        const scroll = getScroll()
        // user hasn't scrolled enough
        if (checkPosition) {
          const diff = Math.abs(scroll.start - lastPosition)
          if (diff < min) {
            return {
              continuous: true,
            }
          }
        }

        lastPosition = scroll.start

        scroll.start -= buffer.value
        scroll.end += buffer.value
        scroll.start = Math.max(scroll.start, 0)
        scroll.end = Math.min(scroll.end, totalSize.value)

        // search startIndex
        startIndex = binarySearchClose(scroll.start)
        startIndex = startIndex === 0 ? 0 : startIndex
        // search endIndex
        endIndex = binarySearchClose(scroll.end, false)
        endIndex = endIndex === 0 ? items.value.length - 1 : endIndex

        // reuse dom
        const newArr = createPool(pool.value, startIndex, endIndex)
        pool.value = newArr

        return {
          continuous: false,
        }
      }

      function binarySearchClose(val: number, prevFirst = true) {
        let s = 0
        let e = count - 1

        while (s < e - 1) {
          const midIndex = ~~((s + e) / 2)
          const mid = sizes.value[midIndex].acc
          if (mid > val)
            e = midIndex
          else if (mid < val)
            s = midIndex
          else
            return midIndex
        }
        return prevFirst ? s : e
      }

      function createPool(oldPool: ListPool[], start: number, end: number): ListPool[] {
        const len = end - start + 1
        const max = Math.max(oldPool.length, len)

        return Array.from({ length: max }, (_, i) => {
          if (i >= len - 1)
            return { acc: -9999, size: 0, item: { id: `${uid--}`, h: 0 } }

          return { item: items.value[start + i], ...sizes.value[start + i] }
        })
      }
    }

    function getScroll() {
      const el = (instance!.proxy as ComponentPublicInstance).$el as HTMLElement
      return el
        ? { start: el.scrollTop, end: el.scrollTop + el.clientHeight }
        : { start: 0, end: 0 }
    }

    let _scrollFlag = false
    function onScroll() {
      if (!_scrollFlag) {
        _scrollFlag = true
        requestAnimationFrame(() => {
          _scrollFlag = false
          updateVisibleItems({ checkPosition: true })
        })
      }
    }

    function onVisibilityChange(isVisible: boolean) {
      if (isVisible) {
        requestAnimationFrame(() => {
          updateVisibleItems({ checkPosition: false })
        })
      }
    }

    let _target: HTMLElement | Window
    function getScrollParent() {
      _target = ScrollParent(instance?.proxy?.$el)!
      if (
        window.document
          && (
            _target === window.document.documentElement
              || _target === window.document.body
          )
      )
        _target = window

      return _target
    }
    // TODO: resize Observe
    function addListeners() {
      _target = getScrollParent()
      _target.addEventListener('scroll', onScroll, { passive: true })
    }
    function removeListeners() {
      _target.removeEventListener('scroll', onScroll)
    }

    return {
      pool,
      onVisibilityChange,
      totalSize,
      onScroll,
    }
  },
},
)

</script>

<style lang="scss">
.virtual-list {
  height: 100%;
  overflow: auto;
}
.virtual-wrap {
  overflow: hidden;
  position: relative;
}
.virtual-item {
  position: absolute;
  top: 0;
}
</style>
