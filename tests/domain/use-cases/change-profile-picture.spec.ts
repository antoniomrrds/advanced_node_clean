import { UploadFile } from '@/domain/ports'
import { setupChangeProfilePicture } from '@/domain/use-cases'
import { mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)

    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
