import { RequiredFieldError } from '@/presentation/errors'
import { Validator } from '@/presentation/validation/ports'

export class RequiredStringValidator implements Validator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) { }

  validate (): Error | undefined {
    if ([undefined, null, ''].includes(this.value)) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
