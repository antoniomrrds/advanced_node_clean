import { ChangeProfilePicture } from '@/domain/use-cases'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error

export class SavePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ file, userId }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) { return badRequest(new InvalidMimeTypeError(['png', 'jpeg'])) }
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    await this.changeProfilePicture({ id: userId, file: file.buffer })
  }
}
