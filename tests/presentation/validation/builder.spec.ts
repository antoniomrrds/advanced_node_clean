import { RequiredStringValidator, ValidationBuilder } from '@/presentation/validation'

describe('ValidationBuilder', () => {
  it('should return RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', filedName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})
