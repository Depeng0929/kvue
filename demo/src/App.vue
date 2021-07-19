<template>
  <div class="container">
    <div class="info">
      Scroll
    </div>
    <div class="test-wrap">
      <div
        v-show="show"
        v-observe="{
          callback: visibleChange,
          once,
          throttle: 500
        }"
        class="test"
      >
        <p>Hello world!</p>
        <p>Hello world!</p>
        <p>Hello world!</p>
        <p>Hello world!</p>
        <p>Hello world!</p>
        <p>Hello world!</p>
        <p>Hello world!</p>
        <p>Hello world!</p>
        <p>Hello world!</p>
      </div>
    </div>
    <div class="toolbar">
      <input id="is-visible" v-model="isVisible" type="checkbox" disabled>
      <label for="is-visible">Is visible?</label>

      <button class="ml toggle" @click="onToggle">
        toggle
      </button>

      <input id="once" v-model="once" type="checkbox">
      <label for="once">Once</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const isVisible = ref(false)
    const show = ref(true)
    const once = ref(false)

    const onToggle = () => {
      show.value = !show.value
    }
    const visibleChange = (visibleResult, entry) => {
      isVisible.value = visibleResult
      console.log('visible change', visibleResult)
    }
    return {
      show,
      isVisible,
      once,
      onToggle,
      visibleChange,
    }
  },
})
</script>

<style>
.info {
  display: flex;
  justify-content: center;
  align-items: center;
}
.test-wrap {
  margin: 3000px 0;
  height: 400px;
  background-color: grey;
}
.test {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.toolbar {
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
}
.toolbar > .ml {
  margin-left: 20px;
}

</style>
