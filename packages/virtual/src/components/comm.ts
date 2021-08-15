import type { InjectionKey } from 'vue'

export const props = {

}

export interface DynamicScrollContext {
  sizes: {
    [p: number]: number
  }
  resizeObserver: ResizeObserver
  updateItemSize: (i: number, v: any) => void
}
export const dynamicScrollKey: InjectionKey<DynamicScrollContext> = 'dynamicScroll' as any
