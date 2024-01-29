import { SavePictureController } from '@/presentation/controllers'
import { RequiredFieldError } from '@/presentation/errors'

describe('SavePictureController', () => {
  let sut: SavePictureController
  beforeEach(() => {
    sut = new SavePictureController()
  })

  describe.each([
    ['file is undefined', undefined] as const,
    ['file is null', null] as const,
    ['file is empty', { buffer: Buffer.from('') }] as const
  ])('File is invalid', (testName, file: any) => {
    it(`Should return 400 if ${testName}`, async () => {
      const response = await sut.handle({ file })

      expect(response).toEqual({ statusCode: 400, body: new RequiredFieldError('file') })
    })
  })
})
