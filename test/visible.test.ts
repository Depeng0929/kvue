import { deepEqual, isObject } from '../packages/visible/src/util'

describe('visible util', () => {
  it('isObject', () => {
    expect(isObject('Tom')).toBeFalsy()
    expect(isObject(null)).toBeFalsy()
    expect(isObject({ name: 'Tom' })).toBeTruthy()
    expect(isObject(() => {})).toBeFalsy()
  })

  it('deepEqual', () => {
    const a = {
      name: 'Tom',
      age: 12,
      other: {
        name2: 'T',
      },
    }
    const b = {
      name: 'Tom',
      age: 12,
      other: {
        name2: 'T',
      },
    }
    const c = {
      name: 'Tom',
      age: 13,
    }

    expect(deepEqual(a, b)).toBeTruthy()
    expect(deepEqual(a, c)).toBeFalsy()
    expect(deepEqual(b, c)).toBeFalsy()
  })
})
