import { Cancel, CancelToken } from './index'

export interface CancelCallback {
  (reason: string): void
}

export interface CancelCallbackExecutor {
  (cb: CancelCallback): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: CancelCallback
}

export interface CancelClass {
  new (message: string): Cancel
  isCancel(val: any): boolean
}
