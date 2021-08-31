import { findValue } from '../../../packages/klib/src'

describe('picker', () => {
  it('findValue', () => {
    const list = [{ key: 1, value: 1 }, { key: 2, value: 2 }]

    expect(findValue('key', 'value')(list, 1)).toBe(1)
    expect(findValue('key', 'value')(list, 4)).toBe(undefined)
  })
})
