import { Validator, ValidationComposite } from '@/presentation/validation'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })
  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock()
    validator2.validate.mockReturnValue(undefined)
    validators = [validator1, validator2]
  })
  it('Should return undefined if all validators return undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
