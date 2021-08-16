<template>
  <VirtualList :items="itemsWithSize">
    <template #default="{item}">
      <slot :item="item"></slot>
    </template>
  </VirtualList>
</template>

<script lang="ts">
import { PropType, computed, reactive, provide, defineComponent, toRefs } from 'vue'
import { ListItem } from '../types'
import VirtualList from './VirtualList.vue'
import { dynamicScrollKey, props as commonProps } from './comm'

type ISize = {
  [p: string]: number
}

export default defineComponent({
  name: 'DynamicScroller',

  components: {
    VirtualList,
  },

  props: {
    ...commonProps,

    items: {
      type: Array as PropType<ListItem[]>,
      required: true,

    },
  },

  setup(props) {
    const { items } = toRefs(props)

    const sizes = reactive<ISize>({})
    const updateItemSize = (index: string, val: any) => {
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
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
