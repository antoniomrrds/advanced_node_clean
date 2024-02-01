import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/presentation/controllers/controller'
import { HttpResponse } from '@/presentation/ports'
import { ok } from '@/presentation/helpers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, Validator } from '@/presentation/validation'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | {
  initials?: string
  pictureUrl?: string
}

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return ok(result)
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    return [
      new Required(file, 'file'),
      new RequiredBuffer(file.buffer, 'file'),
      new AllowedMimeTypes(['jpg', 'png'], file.mimeType),
      new MaxFileSize(5, file.buffer)
    ]
  }
}
