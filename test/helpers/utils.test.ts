import {
  isObj,
  isPlainObj,
  isDate,
  isFormData,
  isURLSearchParams,
  canToJson,
  tryJsonParse,
  combinedObj,
  deepMerge
} from '../../src/helpers/utils'

describe('helpers/utils', () => {
  describe('val instanceof XXX', () => {
    test('should validate Object', () => {
      expect(isObj({})).toBeTruthy()
      expect(isObj([])).toBeTruthy()
      expect(isObj(null)).toBeFalsy()
      expect(isObj(1)).toBeFalsy()
    })
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })
    test('should validate PlainObj', () => {
      expect(isPlainObj({})).toBeTruthy()
      expect(isPlainObj([])).toBeFalsy()
    })
    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy
      expect(isFormData({})).toBeFalsy()
    })
    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams({})).toBeFalsy()
    })
  })

  describe('canToJson', () => {
    test('should set "content-type:application/json"', () => {
      expect(canToJson([])).toBeTruthy()
      expect(canToJson({})).toBeTruthy()
      expect(canToJson(new Date())).toBeFalsy()
    })
  })

  describe('tryJsonParse', () => {
    test('should JSON to obj ', () => {
      expect(typeof tryJsonParse(JSON.stringify({}))).toBe('object')
      expect(typeof tryJsonParse({})).toBe('object')
    })
  })

  describe('combine the propertys pf many objects propertys', () => {
    test('should combined objects into first object', () => {
      const o1: any = { a: 1 },
        o2 = { a: 2, b: 3 }
      combinedObj(o1, o2)
      expect(o1.a).toBe(1)
      expect(o1.b).toBe(3)
      expect(o2.a).toBe(2)
    })

    test('should be immutable', () => {
      const o1: any = { a: 1 },
        o2 = { a: 2, b: 3 },
        o3 = deepMerge(o1, o2)

      expect(o1.a).toBe(1)
      expect(o1).not.toHaveProperty('b')
      expect(o2.a).toBe(2)
      expect(o3.a).toBe(2)
      expect(o3.b).toBe(3)
    })

    test('should handle null and undefined of propertys', () => {
      expect(combinedObj(undefined)).toEqual({})
      expect(combinedObj(null)).toEqual({})
      expect(combinedObj(undefined, { a: 1 })).toEqual({ a: 1 })

      expect(deepMerge(undefined)).toEqual({})
      expect(deepMerge(null)).toEqual({})
      expect(deepMerge(undefined, { a: 1 })).toEqual({ a: 1 })
    })
  })
})
