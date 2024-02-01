import {
  AllowedMimeTypes, Extension, MaxFileSize, Required, RequiredBuffer, RequiredString, ValidationBuilder
} from '@/presentation/validation'

describe('ValidationBuilder', () => {
  let buffer: Buffer
  let mimeType: string
  let maxSizeInMb: number
  let allowed: Extension[]

  beforeAll(() => {
    buffer = Buffer.from('any_value')
    mimeType = 'image/png'
    maxSizeInMb = 6
    allowed = ['png']
  })
  it('should return RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value')])
  })
  it('should return RequiredBuffer', () => {
    const validators = ValidationBuilder
      .of({ value: buffer })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })
  it('Should return Required', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'value' } })
      .required()
      .build()

    expect(validators).toEqual([new Required({ any: 'value' })])
  })
  it('Should return Required and RequiredBuffer when exists buffer', () => {
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .required()
      .build()

    expect(validators).toEqual([
      new Required({ buffer }),
      new RequiredBuffer(buffer)])
  })
  it('Should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .image({ allowed, maxSizeInMb })
      .build()

    expect(validators).toEqual([new MaxFileSize(maxSizeInMb, buffer)])
  })
  it('Should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType } })
      .image({ allowed, maxSizeInMb })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(allowed, mimeType)])
  })
  it('Should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType } })
      .image({ allowed, maxSizeInMb })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(allowed, mimeType),
      new MaxFileSize(maxSizeInMb, buffer)
    ])
  })
})
