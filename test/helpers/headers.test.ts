import {
  complementContentType,
  flatHeaders,
  addTokenToHeaders,
  supportAuthorization,
  deleteHeadersProps,
  CONTENT_TYPE,
  AUTHORIZATION
} from '../../src/helpers/headers'
import defaultConfig from '../../src/default'
import { AxiosRequestConfig } from '../../src'

const getConfig = (): AxiosRequestConfig => JSON.parse(JSON.stringify(defaultConfig))

describe('helpers/headers', () => {
  test('should auto add on not have "Content-Type" ', () => {
    expect(complementContentType({}, { data: [] })[CONTENT_TYPE]).toBe(
      'application/json; charset=UTF-8'
    )
    expect(complementContentType({}, {})[CONTENT_TYPE]).toBe('application/json; charset=UTF-8')
    expect(complementContentType({}, 1)).not.toHaveProperty(CONTENT_TYPE)
    expect(complementContentType({ [CONTENT_TYPE]: 123 }, {})[CONTENT_TYPE]).toBe(123)
  })

  test('should flat propertys of header', () => {
    const headers = flatHeaders(getConfig().headers, 'get')
    for (const prop of deleteHeadersProps) {
      expect(headers).not.toHaveProperty(prop)
    }
    expect(headers).toHaveProperty('Accept')
  })

  test('should add Authorization to headers', () => {
    const config = getConfig()
    config.auth = {
      password: '123456',
      username: 'hilx'
    }
    supportAuthorization(config)
    expect(config.headers).toHaveProperty(AUTHORIZATION)
  })

  describe('add token to headers', () => {
    /* 先测试没有 */
    test('should can not read token', () => {
      const config = getConfig()
      document.cookie = ''
      config.withCredentials = true
      const headers = addTokenToHeaders(config)
      expect(headers[defaultConfig.xsrfHeaderName!]).toBeUndefined()
    })

    test('should read token  to headers', () => {
      document.cookie = 'X-XSRF-TOKEN=a'
      const config = getConfig()
      config.withCredentials = true
      const headers = addTokenToHeaders(config)
      expect(headers[defaultConfig.xsrfHeaderName!]).toBe('a')
    })
  })
})
