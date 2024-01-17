import { UploadFile } from '@/domain/ports'

type Setup = (fileStorage: UploadFile) => ChangeProfilePicture
type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = fileStorage => async ({ id, file }) => {
  await fileStorage.upload({ file, key: id })
}
