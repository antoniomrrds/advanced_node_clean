import { RequiredFieldError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'

type HttpRequest = { file: { buffer: Buffer } }
type Model = Error

export class SavePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'))
  }
}
