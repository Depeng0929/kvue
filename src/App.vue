<template>
  <app-button @click="onClick">点我</app-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppButton from '/@/components/Button/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppButton,
  },
  setup() {
    function onClick(e) {
      console.log(e)
    }
    return {
      onClick,
    }
  },
})
</script>

<style lang="scss" scoped></style>
