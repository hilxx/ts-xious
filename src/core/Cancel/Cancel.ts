export default class Cancel {
  message: string

  constructor(message: string) {
    this.message = message
  }

  static isCancel(val: any): val is Cancel {
    return val instanceof Cancel
  }
}
