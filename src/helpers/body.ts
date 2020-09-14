import { canToJson } from './utils'

export const transformRequestData = (data: any): any => {
    if (canToJson(data)) {
      return JSON.stringify(data)
    }
    return data
  },
  transformResponseData = transformRequestData
