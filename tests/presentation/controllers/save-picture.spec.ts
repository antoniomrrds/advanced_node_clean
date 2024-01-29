import { SavePictureController } from '@/presentation/controllers'
import { RequiredFieldError } from '@/presentation/errors'

describe('SavePictureController', () => {
  let sut: SavePictureController
  beforeEach(() => {
    sut = new SavePictureController()
  })
  it('Should return 400 if file is not provided', async () => {
    const response = await sut.handle({ file: undefined })

    expect(response).toEqual({ statusCode: 400, body: new RequiredFieldError('file') })
  })
})
