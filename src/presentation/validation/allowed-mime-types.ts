import { InvalidMimeTypeError } from '@/presentation/errors'

type Extension = 'png' | 'jpeg'

export class AllowedMimeTypes {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) {}

  validate (): Error {
    return new InvalidMimeTypeError(this.allowed)
  }
}
