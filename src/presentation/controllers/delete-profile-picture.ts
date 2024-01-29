import { ChangeProfilePicture } from '@/domain/use-cases'
import { noContent } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'

type HttpRequest = { userId: string }

export class DeletePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id: userId })
    return noContent()
  }
}
