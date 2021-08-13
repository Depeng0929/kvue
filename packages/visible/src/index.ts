import { App } from 'vue'
import ObserveVisibility from './directives'

export {
  ObserveVisibility,
}

export default {
  install: (app: App) => {
    app.directive('observe-visibility', ObserveVisibility)
  },
}
