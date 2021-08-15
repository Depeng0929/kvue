<template>
  <VirtualList :items="itemsWithSize">
    <template #default="{item}">
      <slot :item="item"></slot>
    </template>
  </VirtualList>
</template>

<script lang="ts">
import { PropType, ref, computed, reactive, provide, defineComponent, toRefs } from 'vue'
import VirtualList from './VirtualList.vue'
import { dynamicScrollKey } from './comm'

export default defineComponent({
  name: 'DynamicScroller',

  components: {
    VirtualList,
  },

  props: {
    // TODO: props同VirtualList优化
    items: {
      type: Array as PropType<any[]>,
      default() {
        return []
      },
    },
  },

  setup(props) {
    const { items } = toRefs(props)

    const sizes = reactive({})
    const updateItemSize = (index: number, val: any) => {
      sizes[index] = val
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target) {
          const event = new CustomEvent('resize', {
            detail: {
              contentRect: entry.contentRect,
            },
          })
          entry.target.dispatchEvent(event)
        }
      }
    })

    provide(dynamicScrollKey, { sizes, resizeObserver, updateItemSize })

    const itemsWithSize = computed(() => {
      const result = []

      for (let i = 0, l = items.value.length; i < l; i++) {
        const currentItem = items.value[i]
        const size = sizes[currentItem.id]
        result.push({
          ...currentItem,
          h: size || 0,
        })
      }

      return result
    })

    return {
      itemsWithSize,
      sizes,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
