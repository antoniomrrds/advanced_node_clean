/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { RequiredFieldError } from '@/presentation/errors'
import { RequiredStringValidator } from '@/presentation/validation'

describe('RequiredStringValidatior', () => {
  it('Should return an RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field')

    const error = sut.validate()

    expect(error).toStrictEqual(new RequiredFieldError('any_field'))
  })
  it('Should return an RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toStrictEqual(new RequiredFieldError('any_field'))
  })
  it('Should return an RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toStrictEqual(new RequiredFieldError('any_field'))
  })
  it('Should return undefined if value is not empty', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
