import { transformRequestData } from '../../src/helpers/body'

describe('helpers/body', () => {
  test('should can transform JSON', () => {
    expect(typeof transformRequestData([])).toBe('string')
    expect(typeof transformRequestData({})).toBe('string')
    expect(transformRequestData(new Date()) instanceof Date).toBeTruthy()
  })
})
