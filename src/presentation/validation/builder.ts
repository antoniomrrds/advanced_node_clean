import { RequiredStringValidator, Validator } from '@/presentation/validation'

export class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of ({ value, filedName }: { value: string, filedName: string }): ValidationBuilder {
    return new ValidationBuilder(value, filedName)
  }

  required (): this {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
