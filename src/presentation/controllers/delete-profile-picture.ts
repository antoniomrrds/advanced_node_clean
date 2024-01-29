import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/presentation/controllers/controller'
import { noContent } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'

type HttpRequest = { userId: string }

export class DeletePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id: userId })
    return noContent()
  }
}
