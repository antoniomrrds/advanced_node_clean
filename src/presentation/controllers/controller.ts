import { badRequest, serverError } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'
import { ValidationComposite, Validator } from '@/presentation/validation'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>
  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      const error = this.validate(httpRequest)
      return (error)
        ? badRequest(error)
        : await this.perform(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
