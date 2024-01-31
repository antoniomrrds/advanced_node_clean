/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { RequiredFieldError } from '@/presentation/errors'
import { Required, RequiredBuffer, RequiredString } from '@/presentation/validation'

describe('Required', () => {
  it.each([
    { type: 'null', expected: null },
    { type: 'undefined', expected: undefined }
  ])('Should return an RequiredFieldError if value is $type', ({ expected }) => {
    const sut = new Required(expected as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })
  it('Should return undefined if value is not empty', () => {
    const sut = new Required('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

describe('RequiredString', () => {
  it('Should extends RequiredValidator', () => {
    const sut = new Required('')
    expect(sut).toBeInstanceOf(Required)
  })
  it.each([
    { expected: '' },
    { expected: '  ' }
  ])('Should return an RequiredFieldError if the value contains space or is empty', ({ expected }) => {
    const sut = new RequiredString(expected, 'any_field')

    const error = sut.validate()

    expect(error).toStrictEqual(new RequiredFieldError('any_field'))
  })
  it('Should return undefined if value is not empty', () => {
    const sut = new RequiredString('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

describe('RequiredBuffer', () => {
  it('Should extends Required', () => {
    const sut = new Required(Buffer.from(''))
    expect(sut).toBeInstanceOf(Required)
  })
  it('Should return an RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError())
  })
  it('Should return undefined if value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'))

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
