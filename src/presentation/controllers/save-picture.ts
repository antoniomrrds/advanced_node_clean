import { InvalidMimeTypeError, RequiredFieldError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'

type HttpRequest = { file: { buffer: Buffer, mimeType: string } }
type Model = Error

export class SavePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) { return badRequest(new InvalidMimeTypeError(['png', 'jpeg'])) }
  }
}
