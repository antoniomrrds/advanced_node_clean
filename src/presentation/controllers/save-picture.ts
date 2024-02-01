import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/presentation/controllers/controller'
import { HttpResponse } from '@/presentation/ports'
import { ok } from '@/presentation/helpers'
import { Validator, ValidationBuilder as Builder } from '@/presentation/validation'

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
      ...Builder.of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowed: ['jpg', 'png'], maxSizeInMb: 5 })
        .build()
    ]
  }
}
