import { InvalidMimeTypeError } from '@/presentation/errors'
import { AllowedMimeTypes } from '@/presentation/validation'

describe('AllowedMimeTypes', () => {
  it('Should return an InvalidMimeTypeError if value is not allowed', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })
})
