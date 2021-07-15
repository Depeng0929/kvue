import { ObserveOptions, ObserveCallback } from './types'
import { throttle } from './util'

class ObserveVisibility {
  private el: HTMLElement
  private observer: IntersectionObserver | null = null
  private options: ObserveOptions | null = null
  private callback: ObserveCallback = () => { }
  private froze = false
  private oldResult: boolean | undefined = undefined

  constructor(el: HTMLElement, options: ObserveOptions) {
    this.el = el
    this.createObserver(options)
  }

  get threshold() {
    const threshold = this.options?.intersection?.threshold
    return typeof threshold === 'number' ? threshold : 0
  }

  public createObserver(options: ObserveOptions) {
    if (this.observer)
      this.destoryObserver()

    if (this.froze) return

    this.options = options

    // once
    this.callback = (result: boolean, entry: IntersectionObserverEntry) => {
      this.options?.callback(result, entry)
      if (result && this.options?.once) {
        this.froze = true
        this.destoryObserver()
      }
    }

    // Throttle
    if (this.callback && this.options.throttle)
      this.callback = throttle(this.callback, this.options.throttle)

    this.observer = new IntersectionObserver((entries) => {
      let entry = entries[0]
      if (entries.length > 1) {
        const firstEntry = entries.find(e => e.isIntersecting)
        if (firstEntry)
          entry = firstEntry
      }

      if (this.callback) {
        const result = entry.isIntersecting && entry.intersectionRatio > this.threshold
        // 相同结果不需要执行
        if (result === this.oldResult) return
        this.oldResult = result
        this.callback(result, entry)
      }
    }, this.options?.intersection)

    this.observer.observe(this.el)
  }

  public destoryObserver() {
    if (!this.observer)
      return

    this.observer.disconnect()
    this.observer = null
  }
}

export default ObserveVisibility
