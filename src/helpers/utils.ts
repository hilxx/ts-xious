const { toString } = Object.prototype,
  OBJECT = '[object Object]'

export const isObj = (obj: any): obj is Object => typeof obj === 'object' && obj !== null,
  isPlainObj = (obj: any): obj is Object => toString.call(obj) === OBJECT,
  isDate = (date: any): date is Date => {
    try {
      Date.prototype.getDate.apply(date)
      return true
    } catch (e) {
      return false
    }
  },
  isToJson = (o: any): boolean => isPlainObj(o) || Array.isArray(o),
  tryJsonParse = (data: any): any => {
    if (typeof data !== 'string') return data
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  },
  combinedObj = (o1: any, ...restObj: any[]): any => {
    for (const obj of restObj) {
      for (const key of Reflect.ownKeys(obj)) {
        if (!Reflect.has(o1, key)) {
          o1[key] = obj[key]
        }
      }
    }
    return o1
  },
  deepMerge = (...restObj: any[]) => {
    const res = {},
      step = (v1: any, v2: any): any => {
        /* v2 同名覆盖 v1 */
        for (const key of Reflect.ownKeys(v2)) {
          if (v1[key] !== v2[key] && isPlainObj(v1[key]) && isPlainObj(v2[key]))
            v1[key] = step(v1[key], v2[key])
          else v1[key] = v2[key]
        }
        return v1
      }

    for (const i of restObj)
      if (isObj(i)) {
        step(res, i)
      }
    return res
  },
  isFormData = (val: any): val is FormData => val instanceof FormData,
  isURLSearchParams = (val: any): val is URLSearchParams => val instanceof URLSearchParams
