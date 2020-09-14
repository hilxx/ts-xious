import { canToJson, deepMerge } from './utils'
import { Methods, AxiosRequestConfig } from '../types'
import { isSameOrgin } from './url'
import { readCookie } from './cookie'

export const CONTENT_TYPE = 'Content-Type',
  AUTHORIZATION = 'Authorization',
  deleteHeadersProps = ['delete', 'options', 'get', 'head', 'post', 'put', 'patch', 'common']

export const /* 添加contnet-type */
  complementContentType = (headers: any, data: any): any => {
    if (!data) return headers
    const keys = Object.keys(headers)
    normalizeHeaderName_(headers, [CONTENT_TYPE])
    if (canToJson(data) && !keys.includes(CONTENT_TYPE)) {
      headers[CONTENT_TYPE] = 'application/json; charset=UTF-8'
    }
    return headers
  },
  flatHeaders = (headers: any, method: Methods = 'GET'): any => {
    if (!headers) return {}

    headers = deepMerge(headers.common, headers[method.toLocaleLowerCase()], headers)
    for (const prop of deleteHeadersProps) {
      delete headers[prop]
    }
    return headers
  },
  addTokenToHeaders = (config: AxiosRequestConfig): any => {
    const { xsrfHeaderName, xsrfCookieName, url, headers, withCredentials } = config
    if (isSameOrgin(url!) || withCredentials) {
      if (xsrfHeaderName && xsrfCookieName) {
        const cookieValue = readCookie(xsrfCookieName)
        if (cookieValue) headers[xsrfHeaderName] = cookieValue
      }
    }
    return headers
  },
  supportAuthorization = (config: AxiosRequestConfig): any => {
    if (config.auth) {
      const { username, password } = config.auth,
        base = btoa(`${username}:${password}`)
      config.headers[AUTHORIZATION] = `Basic ${base}`
    }
    return config.headers
  }

function normalizeHeaderName_(headers: any, renames: string[]): void {
  const keys = Object.keys(headers),
    upKeys = keys.map(key => key.toUpperCase())
  for (const rename of renames) {
    if (keys.includes(rename)) continue
    const idx = upKeys.indexOf(rename.toUpperCase()),
      key = keys[idx]
    if (key) {
      headers[rename] = headers[key]
      delete headers[key]
    }
  }
}
