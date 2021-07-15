import type { DirectiveBinding, App } from 'vue'
import ObserveVisibility from './visibleObserve'
import { deepEqual } from './util'

interface IHTMLElement extends HTMLElement {
  _vue_visibilityState?: ObserveVisibility
}

function mounted(el: IHTMLElement, binding: DirectiveBinding) {
  const { value } = binding
  el._vue_visibilityState = new ObserveVisibility(el, value)
}

function updated(el: IHTMLElement, binding: DirectiveBinding) {
  const { value, oldValue } = binding
  if (deepEqual(value, oldValue)) return

  if (!value) {
    unmounted(el)
    return
  }

  const state = el._vue_visibilityState
  if (state)
    state.createObserver(value)
  else
    mounted(el, binding)
}

function unmounted(el: IHTMLElement) {
  const state = el._vue_visibilityState
  if (state) {
    state.destoryObserver()
    delete el._vue_visibilityState
  }
}

const VObserve = {
  install: (app: App) => {
    app.directive('observe', {
      mounted,
      updated,
      unmounted,
    })
  },
}

export default VObserve
