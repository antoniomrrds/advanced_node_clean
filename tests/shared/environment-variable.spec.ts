import { EnvironmentVariableGetter, getEnvironmentVariableOrDefault } from '@/shared'
import { EnvironmentVariableError } from '@/shared/errors'

type SutTypes = {
  sut: EnvironmentVariableGetter
}

const makeSut = (value: string, defaultValue?: string): SutTypes => {
  const sut = getEnvironmentVariableOrDefault(value, defaultValue)
  return { sut }
}
describe('getOrDefaultEnvironmentVariable', () => {
  beforeEach(() => {
    process.env.TEST = 'any_value'
  })

  afterEach(() => {
    delete process.env.TEST
  })

  it('Should return the value of an existing environment variable', () => {
    const { sut } = makeSut('TEST')
    expect(sut).toEqual('any_value')
  })
  it('Should return the default value if the environment variable is not defined', () => {
    const { sut } = makeSut('NON_EXISTENT_VARIABLE', 'default_value')
    expect(sut).toEqual('default_value')
  })
  it('Should return the default value if the environment variable is empty', () => {
    process.env.TEST = ''
    const { sut } = makeSut('TEST', 'default_value')
    expect(sut).toEqual('default_value')
  })
  it('Should return an error if the environment variable is not defined, empty or undefined and no default value is provided', () => {
    expect(() => makeSut('NON_EXISTENT_VARIABLE').sut).toThrow(EnvironmentVariableError)

    process.env.TEST = ''
    expect(() => makeSut('TEST').sut).toThrow(EnvironmentVariableError)
  })
})
