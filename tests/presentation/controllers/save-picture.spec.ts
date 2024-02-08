import { Controller, SavePictureController } from '@/presentation/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/presentation/validation'

describe('SavePictureController', () => {
  let buffer: Buffer
  const mimeType = 'image/png'
  let file: { buffer: Buffer, mimeType: string }
  let sut: SavePictureController
  let userId: string
  let changeProfilePicture: jest.Mock

  beforeAll(() => {
    userId = 'any_user_id'
    buffer = Buffer.from('any_file')
    file = { buffer, mimeType }
    changeProfilePicture = jest.fn()
    changeProfilePicture.mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
  })
  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })

  it('Should build validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['jpg', 'png'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })
  it('Should build validators correctly on delete', async () => {
    const validators = sut.buildValidators({ file: undefined, userId })

    expect(validators).toEqual([])
  })
  it('Should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ file, userId })
    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
  it('Should rerturn 200 with valid data', async () => {
    const httpResponse = await sut.handle({ file, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        initials: 'any_initials',
        pictureUrl: 'any_url'
      }
    })
  })
  it('Should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
