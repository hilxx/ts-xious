import { CancelToken } from './index'

export interface CancelCallback {
  (reason: string): void
}

export interface CancelThunk {
  (cb: CancelCallback): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: CancelCallback
}
