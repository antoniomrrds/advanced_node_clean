import { getOrDefaultEnvironmentVariable } from '@/shared'

describe('getOrDefaultEnvironmentVariable', () => {
  beforeEach(() => {
    process.env.TEST = 'any_value'
  })

  afterEach(() => {
    delete process.env.TEST
  })

  it('should return the value of an existing environment variable', () => {
    const result = getOrDefaultEnvironmentVariable('TEST')
    expect(result).toEqual('any_value')
  })
})
