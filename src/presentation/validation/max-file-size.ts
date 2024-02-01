import { MaxFileSizeError } from '@/presentation/errors'

export class MaxFileSize {
  constructor (
    private readonly maxSizeMb: number,
    private readonly value: Buffer
  ) {}

  validate (): Error | undefined {
    const maxFileSizeInBytes = 5 * 1024 * 1024
    if (this.value.length > maxFileSizeInBytes) return new MaxFileSizeError(this.maxSizeMb)
  }
}
