import { Validator, ValidationComposite } from '@/presentation/validation'
import { mock } from 'jest-mock-extended'

describe('ValidationComposite', () => {
  it('Should return undefined if all validators return undefined', () => {
    const validator1 = mock<Validator>()
    validator1.validate.mockReturnValue(undefined)
    const validator2 = mock<Validator>()
    validator2.validate.mockReturnValue(undefined)
    const validators = [validator1, validator2]
    const sut = new ValidationComposite(validators)

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
