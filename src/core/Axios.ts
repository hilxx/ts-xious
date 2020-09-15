import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
  Methods,
  NotCarryDataMethods,
  CarryDataMethods
} from '../types'
import disptachRequest from './dispatchRequest'
import InterceptorManeger, { InterceptorsItem } from './InterceptorManeger'
import { mergeConfig, computeConfig } from '../helpers/requestConfig'
import { processUrl } from './dispatchRequest'
import { format } from 'path'

export interface Iterceptor {
  request: InterceptorManeger<AxiosRequestConfig>
  response: InterceptorManeger<AxiosResponse>
}

const requestSymbol = Symbol('request'),
  notCarrySymbol = Symbol('not carry data') /* 不携带data的请求 */,
  carrySymbol = Symbol('carry data') /* 携带data的请求 */

export default class {
  interceptors: Iterceptor
  defaults: AxiosRequestConfig

  constructor(defaultConfig: AxiosRequestConfig = {}) {
    this.defaults = defaultConfig
    this.interceptors = {
      request: new InterceptorManeger<AxiosRequestConfig>(),
      response: new InterceptorManeger<AxiosResponse>()
    }
  }

  [requestSymbol]<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    const { request, response } = this.interceptors,
      train: InterceptorsItem<any>[] = [
        {
          onResolved: (c: AxiosRequestConfig) => disptachRequest<T>(c)
        }
      ]
    /* 栈 */
    request.forEach(interceptor => {
      train.unshift(interceptor)
    })
    /* 队列 */
    response.forEach(interceptor => {
      train.push(interceptor)
    })
    let promise: any = Promise.resolve(config)

    for (let i = 0, len = train.length; i < len; i++) {
      const { onResolved, onRejected } = train[i]
      promise = promise.then(onResolved, onRejected)
    }
    return promise
  }

  [notCarrySymbol]<T>(
    method: NotCarryDataMethods,
    url: string | AxiosRequestConfig,
    config: AxiosRequestConfig = {}
  ) {
    const formatConfig = computeConfig(url, config)
    formatConfig.method = method
    return this[requestSymbol]<T>(formatConfig)
  }

  [carrySymbol]<T>(
    method: CarryDataMethods,
    url: string | AxiosRequestConfig,
    data?: any | AxiosRequestConfig,
    config?: AxiosRequestConfig
  ) {
    const formatConfig = computeConfig(url, data, config)
    formatConfig.method = method
    return this[requestSymbol]<T>(formatConfig)
  }

  request<T>(url: Methods | AxiosRequestConfig, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[requestSymbol]<T>(computeConfig(url, config))
  }

  /* ----获取---- */
  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[notCarrySymbol]<T>('get', url, config)
  }
  delete<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[notCarrySymbol]<T>('delete', url, config)
  }
  head<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[notCarrySymbol]<T>('head', url, config)
  }
  options<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[notCarrySymbol]<T>('head', url, config)
  }

  /* ----携带data---- */
  post<T>(url: string, data?: any, config: AxiosRequestConfig = {}): AxiosPromise<T> {
    return this[carrySymbol]<T>('post', url, data, config)
  }
  put<T>(url: string, data?: any, config: AxiosRequestConfig = {}): AxiosPromise<T> {
    return this[carrySymbol]<T>('put', url, data, config)
  }
  patch<T>(url: string, data?: any, config: AxiosRequestConfig = {}): AxiosPromise<T> {
    return this[carrySymbol]<T>('patch', url, data, config)
  }

  /* ----其它方法---- */
  getURL(config?: AxiosRequestConfig): string {
    return processUrl(mergeConfig(this.defaults, config))
  }
}
