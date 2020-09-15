import { AxiosRequestConfig } from '../types'
import { deepMerge } from './utils'

export const /* 多参数计算出config */
  computeConfig = (...restProps: any[]): AxiosRequestConfig => {
    let [url, config, data] = restProps

    /* 如果传递了第三个参数： config as data, data as config*/
    if (restProps.length === 3 && data) {
      data.data = config
      config = data
    }
    /* 判断url is config ?  */
    if (typeof url === 'string') {
      config = config || {}
      config.url = url
    } else config = url

    return config as AxiosRequestConfig
  },
  /* 后面覆盖前面 */
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
