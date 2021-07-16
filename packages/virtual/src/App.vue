<template>
  <div class="demo">
    <VirtualList :list="dataSource">
      <template #default="{item}">
        <p>{{ item.name }}</p>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import VirtualList from './components/VirtualList.vue'

import { mock } from './utils/index'
import { ListItem } from './types/index.d'

export default defineComponent({
  name: 'App',
  components: {
    VirtualList,
  },
  setup() {
    const dataSource = markRaw<ListItem[]>(mock(1000))

    return {
      dataSource,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.demo {
  width: 800px;
  height: 600px;
  border: 1px solid red;
}
</style>
