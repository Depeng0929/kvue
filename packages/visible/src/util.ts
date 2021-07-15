export function throttle (this:any, fn: Function, interval: number, ) {
  let timer: NodeJS.Timeout | null = null;
  let firstTime = true;

  return (...args:[] ) => {
    if (firstTime) {
      fn.apply(this, args)
      return firstTime = false
    }

    if (timer) {
      return false
    }

    timer = setTimeout(() => {
      clearTimeout(timer!)
      timer = null
      fn.apply(this, args)
    }, interval || 500)
  }
}

const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

export function deepEqual(val: unknown, val2: unknown) {
  if (val === val2) return true
  if (isObject(val) && isObject(val2)) {
    Object.keys(val).forEach(k => {
			if (!deepEqual(val[k], val2[k])) {
				return false
			}
    })
    return true
  }
  return false
}
