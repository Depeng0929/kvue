import { App } from 'vue'
import ObserveDirectives from './directives'

export {
  ObserveDirectives,
}

export default {
  install: (app: App) => {
    app.directive('observe', ObserveDirectives)
  },
}
