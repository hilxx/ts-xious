import { CancelToken, Cancel } from '../core/cancel'
import { TransformerCallback } from '../core/transformer'
import InterceptorManeger from '../core/InterceptorManeger'
import Axios from '../core/Axios'

export type Methods =
  | 'GET'
  | 'get'
  | 'POST'
  | 'post'
  | 'HEAD'
  | 'head'
  | 'OPTIONS'
  | 'options'
  | 'PUT'
  | 'put'
  | 'PATCH'
  | 'patch'
  | 'DELETE'
  | 'delete'

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

export interface AxiosErrorProps {
  request: XMLHttpRequest
  config: AxiosRequestConfig
  response: AxiosResponse
  code: number | string
}
export type AxiosPromise<T = any> = Promise<AxiosResponse<T>>
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(string: string | AxiosRequestConfig, config?: AxiosRequestConfig): AxiosPromise<T>
}
export interface AxiosStatic extends AxiosInstance {
  Axios: typeof Axios
  CancelToken: typeof CancelToken
  Cancel: typeof Cancel
  create(config?: AxiosRequestConfig): AxiosInstance
  isCancel(val: any): boolean
  all<T>(arr: Array<T | Promise<T>>): Promise<T[]>
  spread<T, Y = any>(cb: (...rest: Array<T>) => Y): (arr: Array<T>) => Y
}
export interface AxiosAuthProps {
  username: string
  password: string
}
export type ParamsSerializer = (params: any) => string
