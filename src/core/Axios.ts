import { AxiosRequestConfig, AxiosPromise, AxiosResponse, Methods } from '../types'
import disptachRequest from './dispatchRequest'
import InterceptorManeger, { InterceptorsItem } from './InterceptorManeger'
import { mergeConfig, computeConfig } from '../helpers/requestConfig'
import { processUrl } from './dispatchRequest'

export interface Iterceptor {
  request: InterceptorManeger<AxiosRequestConfig>
  response: InterceptorManeger<AxiosResponse>
}

const requestSymbol = Symbol('request')
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

  [requestSymbol]<T>(
    method: Methods | undefined,
    url: any,
    data?: any,
    config?: any
  ): AxiosPromise<T> {
    config = mergeConfig(this.defaults, computeConfig(url, data, config))
    config.method = method || config.method
    const { request, response } = this.interceptors,
      train: InterceptorsItem<any>[] = [
        {
          onResolved: disptachRequest
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
    let promise: Promise<any> = Promise.resolve(config)

    for (let i = 0, len = train.length; i < len; i++) {
      const { onResolved, onRejected } = train[i]
      promise = promise.then(onResolved, onRejected)
    }
    return promise
  }

  /* ----获取---- */
  request<T>(url: string | AxiosRequestConfig, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[requestSymbol]<T>(undefined, url, config)
  }
  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[requestSymbol]<T>('get', url, config)
  }
  delete<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[requestSymbol]<T>('delete', url, config)
  }
  head<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[requestSymbol]<T>('head', url, config)
  }
  options<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this[requestSymbol]<T>('head', url, config)
  }

  /* ----携带data---- */
  post<T>(url: string, data?: any, config: AxiosRequestConfig = {}): AxiosPromise<T> {
    return this[requestSymbol]<T>('post', url, data, config)
  }
  put<T>(url: string, data?: any, config: AxiosRequestConfig = {}): AxiosPromise<T> {
    return this[requestSymbol]<T>('put', url, data, config)
  }
  patch<T>(url: string, data?: any, config: AxiosRequestConfig = {}): AxiosPromise<T> {
    return this[requestSymbol]<T>('patch', url, data, config)
  }

  /* ----其它方法---- */
  getURL(config?: AxiosRequestConfig): string {
    return processUrl(mergeConfig(this.defaults, config))
  }
}
