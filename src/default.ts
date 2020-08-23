import { AxiosRequestConfig } from './types'
import { transformHeaders } from './core/header'
import { transformRequestData, transformResponseData } from './helpers/body'

const notData = ['delete', 'get', 'head', 'options'],
  hasData = ['post', 'put', 'patch'],
  defaultConfig: AxiosRequestConfig = {
    method: 'GET',
    timeout: 0,
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*'
      }
    },
    validateStatus(status) {
      if ((status >= 200 && status < 300) || status === 304) return true
      return false
    },
    xsrfHeaderName: 'XSRF-TOKEN',
    xsrfCookieName: 'X-XSRF-TOKEN',
    transformRequest: [
      (data, headers): any => {
        transformHeaders(headers, data)
        return transformRequestData(data)
      }
    ],
    transformResponse: [
      (data, headers): any => {
        return transformResponseData(data)
      }
    ]
  }

notData.map(method => {
  defaultConfig.headers[method] = {}
})

hasData.map(method => {
  defaultConfig.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaultConfig
