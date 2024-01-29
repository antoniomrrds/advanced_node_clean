import { SavePictureController } from '@/presentation/controllers'
import { RequiredFieldError } from '@/presentation/errors'

describe('SavePictureController', () => {
  it('Should return 400 if file is not provided', async () => {
    const sut = new SavePictureController()

    const response = await sut.handle({ file: undefined })

    expect(response).toEqual({ statusCode: 400, body: new RequiredFieldError('file') })
  })
})
