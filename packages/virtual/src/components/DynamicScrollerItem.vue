<script lang="ts">
import {
  inject,
  ref,
  defineComponent,
  h,
  onMounted,
  getCurrentInstance,
  onBeforeUnmount,
  computed,
  PropType,
  watch,
} from 'vue'
import { dynamicScrollKey, DynamicScrollContext } from './comm'

export default defineComponent({
  name: 'DynamicScrollerItem',

  props: {
    item: {
      type: Object as PropType<any>,
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

      const el = instance?.proxy?.$el

      dynamicScrollInstance.resizeObserver.observe(el.parentNode as Element)
      el.parentNode.addEventListener('resize', onResize)
    }

    function unobserveSize() {
      const el = instance?.proxy?.$el
      dynamicScrollInstance.resizeObserver.unobserve(el.parentNode as Element)
      el.parentNode.removeEventListener('resize', onResize)
    }

    function onResize(event) {
      const { height } = event.detail.contentRect
      applySize(height)
    }

    function applySize(h: number) {
      dynamicScrollInstance.updateItemSize(id.value, h)
    }

    return () => h('div', context.attrs, context.slots)
  },
})
</script>
