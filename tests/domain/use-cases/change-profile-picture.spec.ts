import { UserProfile } from '@/domain/entities'
import {
  DeleteFile,
  LoadUserProfile,
  SaveUserPicture,
  UUIDGenerator,
  UploadFile
} from '@/domain/ports'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { mocked } from 'jest-mock'
import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'Antonio Mark RR Soares' })
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances)
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
  it('Should return correct data success', async () => {
    mocked(UserProfile).mockImplementationOnce(_ => ({
      setPicture: jest.fn() as any,
      id: 'any_id',
      initials: 'any_initials',
      pictureUrl: 'any_url'
    }))

    const result = await sut({ id: 'any_id', file })
    expect(result).toMatchObject({
      initials: 'any_initials',
      pictureUrl: 'any_url'
    })
  })
  it('Should call Delete when file exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ id: 'any_id', file })

    promise.catch(_ => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })
})
