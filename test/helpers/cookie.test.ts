import { readCookie } from '../../src/helpers/cookie'

describe('helpers/cookie', () => {
  document.cookie = 'foo=baz'
  test('should read cookies', () => {
    expect(readCookie('foo')).toBe('baz')
  })

  test('should return null if cookie name is not exist', () => {
    expect(readCookie('baz')).toBeNull()
  })
})
