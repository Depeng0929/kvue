import { createApp } from 'vue'
import visibleDirective from '../../packages/visible/src/index'
import App from './App.vue'

const app = createApp(App)
app.use(visibleDirective)

app.mount('#app')
