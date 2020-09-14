import { computeConfig, mergeConfig } from '../../src/helpers/requestConfig'
import { AxiosRequestConfig } from '../../src'

describe('helpers/requestCofig', () => {
  test('should can compute config of request', () => {
    const config = {
      url: '/api/getUser',
      method: 'GET'
    }

    expect(computeConfig(config)).toBe(config)
    expect(computeConfig('/api', config)).toEqual({
      url: '/api',
      method: 'GET'
    })
    expect(computeConfig('/api', null, config)).toEqual({
      url: '/api',
      method: 'GET',
      data: null
    })
  })

  test('should strategy merge Config', () => {
    const config1: AxiosRequestConfig = {
        url: '/api1',
        method: 'GET',
        timeout: 300
      },
      config2: AxiosRequestConfig = {
        url: '/api2',
        method: 'POST'
      },
      mergeResult = mergeConfig(config1, config2)

    expect(config1.url).toBe('/api1')
    expect(config1.method).toBe('GET')
    expect(mergeResult.url).toBe('/api2')
    expect(mergeResult.method).toBe('POST')
    expect(mergeResult.timeout).toBe(300)
  })
})
