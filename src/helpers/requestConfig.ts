import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObj } from './utils'

export const computeConfig = (url: any, data?: any, config?: any): AxiosRequestConfig => {
    if (data === config && data === undefined) return isPlainObj(url) ? url : { url: url }
    if (config === undefined) {
      data.url = url
      return data
    }
    config.data = data
    config.url = url
    return config
  },
  mergeConfig = (() => {
    const strategys: any = {},
      defaultStrat = (v1: any, v2: any): any => (v2 === undefined ? v1 : v2),
      onlyStrat = (v1: any, v2: any): any => v2,
      deepStrat = (v1: any, v2: any): any => deepMerge(v1, v2)

    const onlyKeysStrat = ['url', 'params', 'data'],
      deepkeyStrat = ['headers', 'auth']

    for (const key of onlyKeysStrat) {
      strategys[key] = onlyStrat
    }
    for (const key of deepkeyStrat) {
      strategys[key] = deepStrat
    }

    return (config1: AxiosRequestConfig, config2: AxiosRequestConfig = {}): AxiosRequestConfig => {
      const result: AxiosRequestConfig = {},
        merge = (key: any) =>
          (result[key] = (strategys[key] || defaultStrat)(config1[key], config2[key]))

      for (const key of Reflect.ownKeys(config2)) merge(key)
      for (const key of Reflect.ownKeys(config1)) if (!Reflect.has(result, key)) merge(key)
      return result
    }
  })()
