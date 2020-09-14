import { buildUrl, isSameOrgin, isAbsoluteUrl, combineUrl } from '../../src/helpers/url'

describe('helpers/url', () => {
  describe('build URL', () => {
    test('should support null params', () => {
      expect(buildUrl('/api')).toBe('/api')
    })
    test('should handle hash url', () => {
      expect(buildUrl('/api/#123')).toBe('/api')
    })
    test('should support params', () => {
      expect(buildUrl('/api?z=z', { a: 'a' })).toBe('/api?z=z&a=a')
      expect(buildUrl('/api', { a: 'a' })).toBe('/api?a=a')
    })
    test('should supprt params serializer', () => {
      expect(buildUrl('/api', {}, () => 'a=a')).toBe('/api?a=a')
    })
  })

  describe('url is SameOrigin', () => {
    test('should resolution url with Same', () => {
      expect(isSameOrgin('http://fanyi.youdao.com/')).toBeFalsy()
      expect(isSameOrgin(location.href)).toBeTruthy()
    })
  })

  describe('is absolute URL', () => {
    expect(isAbsoluteUrl('/api')).toBeFalsy()
    expect(isAbsoluteUrl('http://fanyi.youdao.com/')).toBeTruthy()
  })

  describe('baseUrl combine url', () => {
    test('not an absolute url', () => {
      expect(combineUrl('/prefix', '/api')).toBe('/prefix/api')
    })
    test('url is absolute', () => {
      expect(combineUrl('/prefix', 'http://fanyi.youdao.com/')).toBe('http://fanyi.youdao.com/')
    })
  })
})
