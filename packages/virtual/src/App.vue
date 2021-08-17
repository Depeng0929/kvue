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
        <p>{{ item.id }}{{ item.name }}</p>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DynamicScroller from './components/DynamicScroller.vue'
import DynamicScrollerItem from './components/DynamicScrollerItem.vue'
import VirtualList from './components/VirtualList.vue'

import { mock } from './utils'

export default defineComponent({
  name: 'App',
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    VirtualList,
  },
  setup() {
    const dataSource = ref<any[]>([])
    const show = ref(true)

    setTimeout(() => {
      dataSource.value = mock(1000)
    }, 200)

    return {
      dataSource,
      show,
    }
  },
})
</script>

<style>
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
