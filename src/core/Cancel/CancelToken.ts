import { CancelCallbackExecutor, CancelTokenSource, CancelCallback } from './types'
import Cancel from './Cancel'

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  constructor(cb: CancelCallbackExecutor) {
    let outResolve: Function
    this.promise = new Promise(resolve => {
      outResolve = resolve
    })
    cb((reason: string) => {
      if (this.reason) return
      this.reason = new Cancel(reason)
      outResolve(this.reason)
    })
  }

  throwRequested() {
    if (Reflect.has(this, 'reason')) {
      throw {
        token: this.reason,
        message: `this token is arlready used`
      }
    }
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
