import { interceptorResolved, interceptorRejected, InterceptorsItem } from './types'

export default class<T> {
  private interceptors: (InterceptorsItem<T> | null)[]

  constructor() {
    this.interceptors = []
  }

  use(onResolved: interceptorResolved<T>, onRejected?: interceptorRejected): number {
    this.interceptors.push({
      onResolved,
      onRejected
    })
    return this.interceptors.length - 1
  }

  eject(id: number): boolean {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
      return true
    }
    return false
  }

  forEach(fn: (itercetor: InterceptorsItem<T>) => void): void {
    for (const intercetor of this.interceptors)
      if (intercetor) {
        fn(intercetor)
      }
  }
}
