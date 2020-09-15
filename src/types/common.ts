import { CancelToken, Cancel } from '../core/cancel'
import { TransformerCallback } from '../core/transformer'
import Axios from '../core/Axios'

export type NotCarryDataMethods =
  | 'GET'
  | 'get'
  | 'HEAD'
  | 'head'
  | 'OPTIONS'
  | 'options'
  | 'DELETE'
  | 'delete'

export type CarryDataMethods = 'PUT' | 'put' | 'PUT' | 'PATCH' | 'patch' | 'POST' | 'post'

export type Methods = NotCarryDataMethods | CarryDataMethods

export interface AxiosRequestConfig {
  url?: string
  method?: Methods
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number /* ms */
  transformRequest?: TransformerCallback | Array<TransformerCallback>
  transformResponse?: TransformerCallback | Array<TransformerCallback>
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosAuthProps
  validateStatus?: (status: number) => boolean
  paramsSerializer?: ParamsSerializer
  baseURL?: string
  [propName: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  headers: any
  status: number
  statusText: string
  config: AxiosRequestConfig
  request: XMLHttpRequest
}

export type AxiosPromise<T> = Promise<AxiosResponse<T>>
export interface AxiosConstructor extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(string: string | AxiosRequestConfig, config?: AxiosRequestConfig): AxiosPromise<T>
}
export interface AxiosStatic extends AxiosConstructor {
  Axios: typeof Axios
  CancelToken: typeof CancelToken
  Cancel: typeof Cancel
  create(config?: AxiosRequestConfig): AxiosConstructor
  isCancel(val: any): boolean
  all<T>(arr: Array<T | Promise<T>>): Promise<T[]>
  spread<T, Y = any>(cb: (...rest: Array<T>) => Y): (arr: Array<T>) => Y
}
export interface AxiosAuthProps {
  username: string
  password: string
}
export type ParamsSerializer = (params: any) => string
