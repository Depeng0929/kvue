type Compute<A extends any> =
    A extends Function
      ? A
      : { [K in keyof A]: A[K] }

type Merge<O1 extends object, O2 extends object> =
    Compute<O1 & Omit<O2, keyof O1>>

export interface ObserveCallback {
  (result: boolean, entry: IntersectionObserverEntry): any
}

export type IntersectionOptions = Partial<{
  threshold?: number
  root?: HTMLElement
  rootMargin?: string
}>

export type ObserveOptions = Merge<Partial<{
  intersection: IntersectionObserverInit
  throttle: number
  once: boolean
}>, { callback: ObserveCallback }>
