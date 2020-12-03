<template>
  <input type="text" :value="current" @input="onInput" @blur="onBlur" />
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from 'vue'
import { formItemContext, formItemKey } from '../Form/token'

export default defineComponent({
  name: 'AppInput',
  props: {
    modelValue: [String, Number],
  },
  setup(props, { emit }) {
    const current = ref(props.modelValue)
    const formItem = inject(formItemKey, {} as formItemContext)

    watch(props.modelValue, (val) => {
      current.value = val
    })

    function onInput(e) {
      const value = e.target.value
      current.value = value
      emit('update:modelValue', value)
      formItem.formItemMitt.emit('app.input.input', value)
    }

    function onBlur() {
      formItem.formItemMitt.emit('app.input.blur', current.value)
    }
    return {
      current,
      onInput,
      onBlur,
    }
  },
})
</script>

<style lang="scss" scoped></style>
