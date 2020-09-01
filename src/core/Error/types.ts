import { AxiosResponse, AxiosRequestConfig } from '../../types'

export interface AxiosErrorProps {
  request: XMLHttpRequest
  config: AxiosRequestConfig
  response: AxiosResponse
  code: number | string
}
