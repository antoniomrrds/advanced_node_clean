import { RequiredFieldError } from '@/presentation/errors'
import { Validator } from '@/presentation/validation/ports'

type InvalidValue = undefined | null

export class Required implements Validator {
  constructor (
    readonly value: any,
    readonly fieldName?: string
  ) { }

  validate (): Error | undefined {
    if ([undefined, null].includes(this.value as InvalidValue)) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

export class RequiredString extends Required {
  constructor (
    override readonly value: string,
    override readonly fieldName?: string
  ) {
    super(value, fieldName)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || this.value.trim() === '') {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
