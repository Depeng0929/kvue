<template>
  <div
    v-observe-visibility="{callback:onVisibilityChange}"
    class="virtual-list"
    @scroll.passive="onScroll"
  >
    <div class="virtual-wrap" :style="{height: totalSize + 'px'}">
      <div
        v-for="(item) in pool"
        :key="item.id"
        class="virtual-item"
        :style="{
          transform:`translateY(${item.acc - item.item.h}px)`,
        }"
      >
        <slot :item="item.item"></slot>
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
import { ObserveVisibility } from '@depeng9527/visible'
import ScrollParent from 'scrollparent'
import { ListItem, Direction } from '../types'
export default defineComponent({
  name: 'VirtualList',
  directives: {
    ObserveVisibility,
  },
  props: {
    items: {
      type: Array as PropType<ListItem[]>,
      required: true,
    },
    buffer: {
      type: Number,
      default: 200,
    },
    direction: {
      type: String as PropType<Direction>,
      default: 'vertical',
    },
  },
  setup(props) {
    let min = 1000
    let lastPosition = 0

    const { items, buffer } = toRefs(props)

    const pool = ref([])
    const totalSize = ref(0)
    const instance = getCurrentInstance()

    const sizes = computed(() => {
      const result = {
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
        startIndex = searchClose(scroll.start)
        startIndex = startIndex === 0 ? 0 : startIndex
        // search endIndex
        endIndex = searchClose(scroll.end, false)
        endIndex = endIndex === 0 ? items.value.length - 1 : endIndex

        const newArr = []
        for (let i = startIndex; i <= endIndex; i++)
          newArr.push({ item: items.value[i], ...sizes.value[i] })

        pool.value = newArr
        return {
          continuous: false,
        }
      }

      function searchClose(val, prevFirst = true) {
        let s = 0
        let e = count - 1
        let result = 0

        while (s < e - 1) {
          const midIndex = ~~((s + e) / 2)
          const mid = sizes.value[midIndex].acc
          if (mid > val)
            e = midIndex
          else if (mid < val)
            s = midIndex
          else
            return result = midIndex
        }
        return prevFirst ? s : e
      }
    }

    function getScroll() {
      const el = instance?.proxy?.$el
      return el
        ? { start: el.scrollTop, end: el.scrollTop + el.clientHeight }
        : { start: 0, end: 0 }
    }

    function onScroll() {
      requestAnimationFrame(() => {
        updateVisibleItems({ checkPosition: true })
      })
    }

    function onResize() {
      updateVisibleItems({ checkPosition: false })
    }

    function onVisibilityChange(isVisible) {
      if (isVisible) {
        requestAnimationFrame(() => {
          updateVisibleItems({ checkPosition: false })
        })
      }
    }

    let target
    function getScrollParent() {
      target = ScrollParent(instance?.proxy?.$el) as Element
      if (
        window.document
          && (
            target === window.document.documentElement
              || target === window.document.body
          )
      )
        target = window

      return target
    }
    // TODO: resize Observe
    function addListeners() {
      target = getScrollParent()
      target.addEventListener('scroll', onScroll, { passive: true })
    }
    function removeListeners() {
      target.removeEventListener('scroll', onScroll, { passive: true })
    }

    return {
      pool,
      onVisibilityChange,
      sizes,
      min,
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
