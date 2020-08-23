import { AxiosRequestConfig, AxiosResponse, AxiosErrorProps } from '../types'

export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code: number | string
  request: XMLHttpRequest
  response: AxiosResponse

  constructor(message: string, restProps: AxiosErrorProps) {
    super(message)
    const { config, code, request, response } = restProps

    this.isAxiosError = true
    this.config = config
    this.code = code
    this.request = request
    this.response = response
  }
}

export default function(message: string, config: AxiosErrorProps): AxiosError {
  return new AxiosError(message, config)
}
