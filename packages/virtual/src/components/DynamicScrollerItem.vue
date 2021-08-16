<script lang="ts">
import {
  inject,
  defineComponent,
  h,
  onMounted,
  getCurrentInstance,
  onBeforeUnmount,
  computed,
  PropType,
} from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { ListItem } from '../types'
import { dynamicScrollKey, DynamicScrollContext } from './comm'

export default defineComponent({
  name: 'DynamicScrollerItem',

  props: {
    item: {
      type: Object as PropType<ListItem>,
      required: true,
    },
  },

  setup(props, context) {
    const dynamicScrollInstance = inject(dynamicScrollKey, {} as DynamicScrollContext)
    const instance = getCurrentInstance()

    const id = computed(() => {
      return props.item.id
    })

    onMounted(() => {
      observeSize()
    })

    onBeforeUnmount(() => {
      unobserveSize()
    })

    function observeSize() {
      if (!dynamicScrollInstance.resizeObserver) return

      const el = getElTarget()

      dynamicScrollInstance.resizeObserver.observe(el.parentNode as Element)
      el.parentNode!.addEventListener('resize', onResize)
    }

    function unobserveSize() {
      const el = instance?.proxy?.$el
      dynamicScrollInstance.resizeObserver.unobserve(el.parentNode as Element)
      el.parentNode.removeEventListener('resize', onResize)
    }

    function getElTarget() {
      return (instance!.proxy as ComponentPublicInstance).$el as Element
    }

    function onResize(event: Event) {
      const { height } = (event as CustomEvent<{contentRect: DOMRect}>).detail.contentRect
      applySize(height)
    }

    function applySize(h: number) {
      dynamicScrollInstance.updateItemSize(id.value, h)
    }

    return () => h('div', context.attrs, context.slots)
  },
})
</script>
