<template>
  <div ref="root" class="container" @scroll.passive="onScroll">
    <div class="view" :style="{height: `${screenHeight}px`, paddingTop: `${paddingTop}px`}">
      <div v-for="(item, index) in visibleList" :key="index" class="item">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, toRefs, computed, ref, onMounted } from 'vue'

const ListProps = {
  list: {
    type: Array as PropType<unknown[]>,
    default() {
      return []
    },
  },
  itemSize: {
    type: Number,
    default: () => 40,
  },
  poolBuffer: {
    type: Number,
    default: () => 50,
  },
}

export default defineComponent({
  name: 'VirtualList',
  props: ListProps,
  setup(props) {
    const { list, itemSize, poolBuffer } = toRefs(props)

    const root = ref<HTMLElement | null>(null)
    const visibleList = ref<any[]>([])
    const paddingTop = ref<number>(0)

    const screenHeight = computed(() => {
      return list.value.length * itemSize.value
    })

    onMounted(() => {
      calculateRange()
    })

    function calculateRange() {
      const rootScrollTop = root.value!.scrollTop

      const start = Math.floor(rootScrollTop / itemSize.value) - Math.floor(poolBuffer.value / 2)
      const startIndex = Math.max(start, 0)

      const end = startIndex + Math.floor(root.value!.clientHeight / itemSize.value)
          + poolBuffer.value

      const endIndex = Math.min(end, list.value.length)

      visibleList.value = list.value.slice(startIndex, endIndex)
      paddingTop.value = startIndex * itemSize.value
    }

    let forzen = false
    function onScroll() {
      if (forzen) return
      forzen = true
      requestAnimationFrame(() => {
        forzen = false
        calculateRange()
      })
    }
    return {
      paddingTop,
      visibleList,
      screenHeight,
      root,
      onScroll,
    }
  },
})

</script>
<style lang='scss' scoped>
.container {
  width: 100%;
  height:100%;
  overflow: auto;
  .view {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
