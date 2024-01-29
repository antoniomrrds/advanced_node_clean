import { SavePictureController } from '@/presentation/controllers'
import { InvalidMimeTypeError, RequiredFieldError } from '@/presentation/errors'

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
  ])('File is invalid', (testName, file: any) => {
    it(`Should return 400 if ${testName}`, async () => {
      const response = await sut.handle({ file })

      expect(response).toEqual({ statusCode: 400, body: new RequiredFieldError('file') })
    })
  })
  it('Should return 400 if type is invalid', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'invalid_type' } })

    expect(response).toEqual({ statusCode: 400, body: new InvalidMimeTypeError(['png, jpeg']) })
  })
})
