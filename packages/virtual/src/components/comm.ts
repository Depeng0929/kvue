import { PropType } from 'vue'
import type { InjectionKey } from 'vue'

import { Direction } from '../types/index.d'

export const props = {
  buffer: {
    type: Number,
    default: 200,
  },

  direction: {
    type: String as PropType<Direction>,
    default: 'vertical',
  },
}

export interface DynamicScrollContext {
  sizes: {
    [p: number]: number
  }
  resizeObserver: ResizeObserver
  updateItemSize: (i: string, v: any) => void
}
export const dynamicScrollKey: InjectionKey<DynamicScrollContext> = 'dynamicScroll' as any
