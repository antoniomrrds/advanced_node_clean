import { MaxFileSizeError } from '@/presentation/errors'
import { MaxFileSize } from '@/presentation/validation'

describe('AllowedMimeTypes', () => {
  it('Should return MaxFileSizeError if value is valid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))

    const sut = new MaxFileSize(5, invalidBuffer)

    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(5))
  })

  const testCases = [
    { value: '4', expected: 4 * 1024 * 1024 },
    { value: '5', expected: 5 * 1024 * 1024 }
  ]

  it.each(testCases)('Should return undefined if the value equals $value because it is valid', ({ expected }) => {
    const sut = new MaxFileSize(5, Buffer.from(new ArrayBuffer(expected)))

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
