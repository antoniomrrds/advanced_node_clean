import { EnvironmentVariableGetter, getOrDefaultEnvironmentVariable } from '@/shared'
import { EnvironmentVariableError } from '@/shared/errors'

type SutTypes = {
  sut: EnvironmentVariableGetter
}

const makeSut = (value: string, defaultValue?: string): SutTypes => {
  const sut = getOrDefaultEnvironmentVariable(value, defaultValue)
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
  it('should return the default value if the environment variable is not defined', () => {
    const { sut } = makeSut('NON_EXISTENT_VARIABLE', 'default_value')
    expect(sut).toEqual('default_value')
  })
  it('should return an error if the environment variable is not defined and no default value is provided', () => {
    const { sut } = makeSut('NON_EXISTENT_VARIABLE')
    expect(sut).toEqual(new EnvironmentVariableError('NON_EXISTENT_VARIABLE'))
  })

  it('should return the default value if the environment variable is empty', () => {
    process.env.TEST = ''
    const { sut } = makeSut('TEST', 'default_value')
    expect(sut).toEqual('default_value')
  })
  it('should return an error if the environment variable is empty and no default value is provided', () => {
    process.env.TEST = ''
    const { sut } = makeSut('TEST')
    expect(sut).toEqual(new EnvironmentVariableError('TEST'))
  })
})
