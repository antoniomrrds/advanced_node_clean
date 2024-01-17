import { LoadUserProfile, SaveUserPicture, UUIDGenerator, UploadFile } from '@/domain/ports'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { MockProxy, mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    userProfileRepo = mock()
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })
  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
  it('Should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
  it('Should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
  it('Should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
  it('Should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })
  it('Should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
