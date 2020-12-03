<template>
  <button
    :disabled="buttonDisabled"
    :class="[
      'button',
      buttonDisabled ? 'disabled' : '',
      type ? `button-${type}` : '',
      {
        loading: loading,
      },
    ]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { Size } from '/@/types/index.d.ts'
import { isValidateSize } from '/@/utils'

type ButtonType = 'primary' | 'plain' | 'warning'

export default defineComponent({
  name: 'AppButton',
  props: {
    size: {
      type: String as PropType<Size>,
      validator: isValidateSize,
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary',
      validator: (val: string) => {
        return ['primary', 'plain', 'warning'].includes(val)
      },
    },
    disabled: Boolean,
    loading: Boolean,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonDisabled = computed(() => {
      return props.disabled || props.loading
    })

    function handleClick(e: Event) {
      e.preventDefault()
      emit('click', e)
    }
    return {
      buttonDisabled,
      handleClick,
    }
  },
})
</script>

<style lang="scss" scoped></style>
