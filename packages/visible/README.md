# `@kvue/virtual`



## install

```
npm install @depeng9527/virtual
```



## import

```
import Vue from 'vue'
import KObserveVisibility from '@depeng9527/virtual'

Vue.use(KObserveVisibility)
```





## Usage

```vue
<div v-observe="{
  callback: visibilityChanged,
  intersection: {
    root: ...,
    rootMargin: ...,
    throttle: 300,	
    once: false,
    threshold: 0
  },
}">
  
  
  visibilityChanged (isVisible, entry) {
  this.isVisible = isVisible
  console.log(entry)
  },
```

