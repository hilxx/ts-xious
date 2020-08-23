import { isToJson } from './utils'

export const transformRequestData = (data: any): any => {
    if (isToJson(data)) {
      return JSON.stringify(data)
    }
    return data
  },
  transformResponseData = transformRequestData
