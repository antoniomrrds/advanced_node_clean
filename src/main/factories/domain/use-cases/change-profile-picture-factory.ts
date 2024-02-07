import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/use-cases'
import { makeAwsS3FileStorage, makePgUserProfileRepo, makeUUIDHandler } from '@/main/factories/infrastructure'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(
    makeAwsS3FileStorage(),
    makeUUIDHandler(),
    makePgUserProfileRepo()

  )
}
