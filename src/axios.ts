import Axios from './core/Axios'
import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from './types'
import { combinedObj } from './helpers/utils'
import defaultConfig from './default'
import { mergeConfig } from './helpers/requestConfig'
import { Cancel, CancelToken } from './core/cancel'
const prototype = Axios.prototype,
  createAxios = (defaultConfig?: AxiosRequestConfig): AxiosInstance => {
    const axios = new Axios(defaultConfig),
      instance = prototype.request.bind(axios)

    combinedObj(instance, prototype, axios)
    return instance as AxiosInstance
  },
  axios = createAxios(defaultConfig) as AxiosStatic

axios.Axios = Axios as any
axios.Cancel = Cancel as any
axios.isCancel = Cancel.isCancel
axios.CancelToken = CancelToken as any
axios.create = function(config) {
  return createAxios(mergeConfig(defaultConfig, config))
}
axios.all = function(arr) {
  return Promise.all(arr)
}
axios.spread = function(cb) {
  return function(arr) {
    return cb.apply(null, arr)
  }
}

export default axios
