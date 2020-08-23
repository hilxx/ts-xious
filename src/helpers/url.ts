import { isDate, isPlainObj, isURLSearchParams } from './utils'
import { ParamsSerializer } from '../types'
import defaultConfig from '../default'
interface UrlOrgin {
  host: string
  protocol: string
  port: string
}

export const encode = (() => {
    const _specialCharList = [
      [/%40/g, '@'],
      [/%3a/gi, ':'],
      [/%24/g, '$'],
      [/%2c/gi, ','],
      [/%20/g, '+'],
      [/%5b/gi, '['],
      [/%5d/gi, ']'],
      [/%3d/gi, '=']
    ]
    return (url: string): string => {
      return _specialCharList.reduce(
        (prev: string, cur: any[]) => prev.replace(cur[0], cur[1]),
        encodeURIComponent(url)
      )
    }
  })(),
  buildUrl = (url: string, params?: object, paramsSerializer?: ParamsSerializer): string => {
    let hashIndex = url.indexOf('#'),
      serialized: string
    if (~hashIndex) url = url.slice(0, hashIndex)
    if (params == undefined) return url

    switch (true) {
      case !!paramsSerializer:
        serialized = paramsSerializer!(params)
        break

      case isURLSearchParams(params):
        serialized = params.toString()
        break

      default: {
        const parts: string[] = []
        for (let [key, value] of Object.entries(params)) {
          if (value == null) continue
          const valueIsArr = Array.isArray(value),
            part: any[] = valueIsArr ? value : [value]
          key = valueIsArr ? key + '[]' : key
          part.forEach(v => {
            if (isDate(v)) v = v.toISOString()
            if (isPlainObj(v)) v = JSON.stringify(v)
            parts.push(encode(`${key}=${v}`))
          })
        }
        serialized = parts.join('$')
      }
    }
    return url + (url.includes('?') ? '&' : '?') + serialized
  },
  isSameOrgin = (() => {
    const _orgin: UrlOrgin = {
        port: location.port,
        host: location.host,
        protocol: location.protocol
      },
      _originKeys = Object.keys(_orgin),
      _tagA = document.createElement('a')
    return (url: string): boolean => {
      _tagA.setAttribute('href', url)
      for (const key of _originKeys as Array<keyof UrlOrgin>) {
        if ((_tagA[key] as any) !== (_orgin[key] as any)) return false
      }
      return true
    }
  })(),
  isAbsoluteUrl = (() => {
    const reg = /^[\w\+\-\.]+:\/\//
    return (url: string): boolean => reg.test(url)
  })(),
  combineUrl = (base: string, relative: string): string => {
    relative = relative.trim()
    if (isAbsoluteUrl(relative)) return relative
    base = base === undefined ? base : base.trim()
    while (relative[0] === '/') {
      relative = relative.slice(1)
    }
    while (base[base.length - 1] === '/') {
      base = base.slice(0, base.length - 1)
    }
    return `${base}/${relative}`
  }
