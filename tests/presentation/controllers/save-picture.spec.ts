import { SavePictureController } from '@/presentation/controllers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/presentation/errors'

describe('SavePictureController', () => {
  let buffer: Buffer
  const mimeType = 'image/png'
  let sut: SavePictureController
  beforeEach(() => {
    sut = new SavePictureController()
  })
  beforeAll(() => {
    buffer = Buffer.from('any_file')
  })

  describe.each([
    ['file is undefined', undefined],
    ['file is null', null],
    ['file is empty', { buffer: Buffer.from(''), mimeType }]
  ])('File is invalid', (typeName, file: any) => {
    it(`Should return 400 if ${typeName}`, async () => {
      const httpResponse = await sut.handle({ file })

      expect(httpResponse).toEqual({ statusCode: 400, body: new RequiredFieldError('file') })
    })
  })
  it('Should return 400 if type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' } })

    expect(httpResponse).toEqual({ statusCode: 400, body: new InvalidMimeTypeError(['png, jpeg']) })
  })
  it.each([
    { type: 'png', expected: 'image/png' },
    { type: 'jpg', expected: 'image/jpg' },
    { type: 'jpeg', expected: 'image/jpeg' }

  ])('Should not return 400 if the type is equal to $type as it is a valid type', async ({ expected }) => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: expected } })

    expect(httpResponse).not.toEqual({ statusCode: 400, body: new InvalidMimeTypeError(['png, jpeg']) })
  })

  it('Should return 400 if file size is bigger than 5mb', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType } })

    expect(httpResponse).toEqual({ statusCode: 400, body: new MaxFileSizeError(5) })
  })
})
