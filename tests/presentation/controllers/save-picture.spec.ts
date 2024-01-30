import { Controller, SavePictureController } from '@/presentation/controllers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/presentation/errors'

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

  describe.each([
    ['file is undefined', undefined],
    ['file is null', null],
    ['file is empty', { buffer: Buffer.from(''), mimeType }]
  ])('File is invalid', (typeName, file: any) => {
    it(`Should return 400 if ${typeName}`, async () => {
      const httpResponse = await sut.handle({ file, userId })

      expect(httpResponse).toEqual({ statusCode: 400, body: new RequiredFieldError('file') })
    })
  })
  it('Should return 400 if type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' }, userId })

    expect(httpResponse).toEqual({ statusCode: 400, body: new InvalidMimeTypeError(['png, jpeg']) })
  })
  it.each([
    { type: 'png', expected: 'image/png' },
    { type: 'jpg', expected: 'image/jpg' },
    { type: 'jpeg', expected: 'image/jpeg' }

  ])('Should not return 400 if the type is equal to $type as it is a valid type', async ({ expected }) => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: expected }, userId })

    expect(httpResponse).not.toEqual({ statusCode: 400, body: new InvalidMimeTypeError(['png, jpeg']) })
  })

  it('Should return 400 if file size is bigger than 5mb', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId })

    expect(httpResponse).toEqual({ statusCode: 400, body: new MaxFileSizeError(5) })
  })
  it('Should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ file, userId })
    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: buffer })
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
