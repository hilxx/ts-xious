import { TransformerCallback } from './types'

export default (data: any, headers: any, fns: TransformerCallback | TransformerCallback[]) => {
  if (!fns) return data
  fns = Array.isArray(fns) ? fns : [fns]
  for (const fn of fns) {
    data = fn(data, headers)
  }
  return data
}
