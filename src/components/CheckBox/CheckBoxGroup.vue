<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  provide,
  ref,
  toRefs,
  unref,
  watch,
  toRaw,
} from 'vue'
import { checkGroupKey } from '/@/components/Form/token'

export default defineComponent({
  name: '',
  props: {
    modelValue: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const current = ref(props.modelValue)

    watch(
      () => {
        return props.modelValue
      },
      (val) => {
        current.value = val
      },
    )

    function change(childChecked: boolean, childLabel: string) {
      if (childChecked) {
        current.value.push(childLabel)
      } else {
        current.value.splice(current.value.indexOf(childLabel), 1)
      }
      emit('update:modelValue', current.value)
      emit('on-change', current.value)
    }

    provide(checkGroupKey, {
      name: 'CheckBoxGroup',
      change,
      modelValue: ref(props.modelValue),
    })

    return {
      current,
    }
  },
})
</script>

<style lang="scss" scoped></style>
