import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { Cancel } from './cancel'
import AxiosError from './Error/Error'

export default (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    const {
        url,
        method = 'GET',
        data = null,
        headers,
        responseType,
        timeout,
        cancelToken,
        withCredentials,
        onDownloadProgress,
        onUploadProgress,
        validateStatus
      } = config,
      xhr = new XMLHttpRequest()

    xhr.open(method.toLocaleLowerCase(), url!, true)
    listener()
    processHeaders()
    addStates()
    xhr.send(data)

    function listener() {
      xhr.onreadystatechange = () => {
        const { readyState, status, statusText, getAllResponseHeaders } = xhr
        if (readyState === 4) {
          const response: AxiosResponse = {
            status,
            statusText,
            config,
            request: xhr,
            headers: xhr.getAllResponseHeaders(),
            data: responseType === 'text' ? xhr.responseText : xhr.response
          }
          switch (true) {
            case !validateStatus:
              resolve(response)
              break
            case validateStatus!(status):
              resolve(response)
            default:
              reject(
                AxiosError(`Request failed with status code ${status}`, {
                  request: xhr,
                  code: xhr.status,
                  config,
                  response: xhr.response
                })
              )
          }
        }
      }
      xhr.onerror = () => {
        reject(
          AxiosError('Network error', {
            config,
            request: xhr,
            code: xhr.status,
            response: xhr.response
          })
        )
      }
      if (onUploadProgress) xhr.upload.onprogress = onUploadProgress
      if (onDownloadProgress) xhr.onprogress = onDownloadProgress
      if (timeout) {
        xhr.timeout = timeout
        xhr.ontimeout = () => {
          reject(
            AxiosError(`Timeout of ${timeout} ms exceeded`, {
              config,
              request: xhr,
              code: 'ECONNABORTED',
              response: xhr.response
            })
          )
        }
      }
    }
    function processHeaders() {
      if (headers)
        for (const key of Object.keys(headers)) {
          xhr.setRequestHeader(key, headers[key])
        }
    }
    function addStates() {
      responseType && (xhr.responseType = responseType)
      cancelToken &&
        cancelToken.promise.then((reason: Cancel) => {
          xhr.abort()
          reject(reason)
        })
      xhr.withCredentials = Boolean(withCredentials)
    }
  })
}
