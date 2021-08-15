<template>
  <div class="demo">
    <DynamicScroller :items="dataSource">
      <template #default="{item}">
        <DynamicScrollerItem :item="item">
          <p>{{ item.name }}</p>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
  <div class="demo">
    <VirtualList :items="dataSource">
      <template #default="{item}">
        <p>{{ item.name }}</p>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, ref } from 'vue'
import DynamicScroller from './components/DynamicScroller.vue'
import DynamicScrollerItem from './components/DynamicScrollerItem.vue'
import VirtualList from './components/VirtualList.vue'

import { mock } from './utils/index'

export default defineComponent({
  name: 'App',
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    VirtualList,
  },
  setup() {
    const dataSource = ref([])
    const show = ref(true)

    setTimeout(() => {
      const list = mock(1000)
      dataSource.value = list
    }, 200)

    return {
      dataSource,
      show,
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
* {
  margin: 0;
  padding: 0;
}
</style>
