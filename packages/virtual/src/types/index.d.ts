export interface ListItem {
  id: string
  [p: string]: any
}

export interface ListItemWithHeght extends ListItem {
  h: number
}

export type Direction = 'vertical' | 'horizontal'

type ListItemExtraInfo = {
  /**
   * item当前距离顶部位置，px
   */
  acc: number
  /**
   * item当前自身高度
   */
  size: number
}
export interface ListExtraInfo {
  [p: number]: ListItemExtraInfo
}
