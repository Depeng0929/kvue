import type { App } from 'vue'

import VirtualList from './components/VirtualList.vue'
import DynamicScroller from './components/DynamicScroller.vue'
import DynamicScrollerItem from './components/DynamicScrollerItem.vue'

export default {
  install: (app: App) => {
    app.component('VirtualList', VirtualList)
    app.component('DynamicScroller', DynamicScroller)
    app.component('DynamicScrollerItem', DynamicScrollerItem)
  },
}

export {
  VirtualList,
  DynamicScroller,
  DynamicScrollerItem,
}
