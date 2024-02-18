import { makeChangeProfilePicture } from '@/main/factories/domain'
import { makePgTransactionController } from '@/main/factories/presentation/decorators'
import { Controller, SavePictureController } from '@/presentation/controllers'

export const makeSavePictureController = (): Controller => {
  const controller = new SavePictureController(makeChangeProfilePicture())

  return makePgTransactionController(controller)
}
