export interface interceptorResolved<T> {
  (val: T): T | Promise<T>
}

export interface interceptorRejected {
  (reason: any): any
}

export interface InterceptorsItem<T> {
  onResolved: interceptorResolved<T>
  onRejected?: interceptorRejected | undefined
}
