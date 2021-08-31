interface IListItem {
  [p: string]: any
}

export function findValue(keyStr = 'key', valueStr = 'value') {
  return function<T extends IListItem>(list: T[], key: any) {
    const item = list.find(item => item[keyStr] === key)
    return item && item[valueStr]
  }
}
