import { CancelThunk, CancelTokenSource, CancelCallback } from './types'
import Cancel from './Cancel'

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  constructor(cb: CancelThunk) {
    let outResolve: Function
    this.promise = new Promise(resolve => {
      outResolve = resolve
    })
    cb((reason = '') => {
      if (this.reason) return
      this.reason = new Cancel(reason)
      outResolve(this.reason)
    })
  }

  throwRequested() {
    if (Reflect.has(this, 'reason')) throw this.reason
  }

  static source(): CancelTokenSource {
    let cancel!: CancelCallback

    return {
      token: new CancelToken(c => {
        cancel = c
      }),
      cancel
    }
  }
}
