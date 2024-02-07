import { makeChangeProfilePicture } from '@/main/factories/domain'
import { DeletePictureController } from '@/presentation/controllers'

export const makeDeletePictureController = (): DeletePictureController => {
  return new DeletePictureController(makeChangeProfilePicture())
}
