import { InvalidMimeTypeError } from '@/presentation/errors'
import { AllowedMimeTypes, Extension } from '@/presentation/validation'

describe('AllowedMimeTypes', () => {
  it('Should return an InvalidMimeTypeError if value is not allowed', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  type TestData = { name: string, type: Extension, expected: string }

  const testCases: TestData[] = [
    { name: 'png', type: 'png', expected: 'image/png' },
    { name: 'jpeg', type: 'jpg', expected: 'image/jpeg' },
    { name: 'jpg', type: 'jpg', expected: 'image/jpg' }
  ]

  it.each(testCases)('Should return undefined if the value equals $name because it is allowed', ({ type, expected }) => {
    const sut = new AllowedMimeTypes([type], expected)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
