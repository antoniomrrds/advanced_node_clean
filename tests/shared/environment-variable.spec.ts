import { EnvironmentVariableGetter, getOrDefaultEnvironmentVariable } from '@/shared'

type SutTypes = {
  sut: EnvironmentVariableGetter
}

const makeSut = (value: string): SutTypes => {
  const sut = getOrDefaultEnvironmentVariable(value)
  return { sut }
}
describe('getOrDefaultEnvironmentVariable', () => {
  beforeEach(() => {
    process.env.TEST = 'any_value'
  })

  afterEach(() => {
    delete process.env.TEST
  })

  it('should return the value of an existing environment variable', () => {
    const { sut } = makeSut('TEST')
    expect(sut).toEqual('any_value')
  })
})
