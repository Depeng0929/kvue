<template>
  <input type="text" :value="current" @input="onInput" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'AppInput',
  props: {
    modelValue: [String, Number],
  },
  setup(props, { emit }) {
    const current = ref(props.modelValue)

    watch(props.modelValue, (val) => {
      current.value = val
    })

    function onInput(e) {
      const value = e.target.value
      current.value = value
      emit('update:modelValue', value)
    }
    return {
      current,
      onInput,
    }
  },
})
</script>

<style lang="scss" scoped></style>
