import { makeChangeProfilePicture } from '@/main/factories/domain'
import { SavePictureController } from '@/presentation/controllers'

export const makeSavePictureController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePicture())
}
