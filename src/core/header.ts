import { isToJson, deepMerge } from '../helpers/utils'
import { Methods, AxiosRequestConfig } from '../types'
import { isSameOrgin } from '../helpers/url'
import { readCookie } from '../helpers/cookie'

const CONTENT_TYPE = 'Content-Type',
  deleteHeadersProps = ['delete', 'options', 'get', 'head', 'post', 'put', 'patch', 'common']

export const transformHeaders = (headers: any, data: any): object => {
    if (!data) return headers
    const keys = Object.keys(headers)
    normalizeHeaderName_(headers, [CONTENT_TYPE])
    if (isToJson(data) && !keys.includes(CONTENT_TYPE)) {
      headers[CONTENT_TYPE] = 'application/json; charset=UTF-8'
    }
    return headers
  },
  flatHeaders = (headers: any, method: Methods = 'GET'): object => {
    if (!headers) return {}
    headers = deepMerge(headers.common, headers[method], headers)
    for (const prop of deleteHeadersProps) {
      delete headers[prop]
    }
    return headers
  },
  addTokenToHeaders = (config: AxiosRequestConfig): void => {
    const { xsrfHeaderName, xsrfCookieName, url, headers, withCredentials } = config
    if (isSameOrgin(url!) || withCredentials) {
      if (xsrfHeaderName && xsrfCookieName) {
        const cookieValue = readCookie(xsrfCookieName)
        if (cookieValue) headers[xsrfHeaderName] = cookieValue
      }
    }
  },
  supportAuthorization = (config: AxiosRequestConfig): void => {
    if (config.auth) {
      const { username, password } = config.auth,
        base = btoa(`${username}:${password}`)
      config.headers['Authorization'] = `Basic ${base}`
    }
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
