import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildUrl, combineUrl, isFormData } from '../helpers/url'
import { flatHeaders, addTokenToHeaders, supportAuthorization } from '../helpers/header'
import transformer from './transformer/transformer'
const axios = (config: AxiosRequestConfig): AxiosPromise => {
  throwTokenRequested(config)
  processConfig(config)
  return xhr(config).then(response => processResponse(response))
}

export const processConfig = (config: AxiosRequestConfig): AxiosRequestConfig => {
    config.url = processUrl(config)
    /* 传递 headers 是未平铺， 默认值没有覆盖没有属性 */
    config.data = transformer(config.data, config.headers, config.transformRequest!)
    config.headers = processHeaders(config)
    return config
  },
  processUrl = (config: AxiosRequestConfig): string => {
    let url = buildUrl(config.url!, config.params, config.paramsSerializer)
    if (config.baseURL) url = combineUrl(config.baseURL, config.url!)
    return url
  },
  processHeaders = (config: AxiosRequestConfig): any => {
    config.headers = flatHeaders(config.headers, config.method)
    addTokenToHeaders(config)
    supportAuthorization(config)
    if (isFormData(config.data)) delete config.headers['Content-Type']
    return config.headers
  },
  processResponse = (response: AxiosResponse): AxiosResponse => {
    response.data = transformer(response.data, response.headers, response.config.transformResponse!)
    return response
  },
  throwTokenRequested = (config: AxiosRequestConfig): void => {
    /* 一次决议 */
    config.cancelToken && config.cancelToken.throwRequested()
  }

export default axios
