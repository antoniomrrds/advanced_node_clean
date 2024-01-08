import { Controller } from '@/presentation/controllers'
import { ServerError } from '@/presentation/errors'
import { serverError } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'
import { ValidationComposite } from '@/presentation/validation'
import { mocked } from 'jest-mock'

jest.mock('@/presentation/validation/composite')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    body: 'any_value'
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))

    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(ValidationCompositeSpy).toHaveBeenCalledWith([])
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error
    })
  })
  it('Should return 500 if perform throws', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(error)
    })
  })
  it('Should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })

  it('should return a ServerError response with "Server failed. Try again soon" when error is undefined', () => {
    // Arrange
    const error: undefined = undefined
    // Act
    const result = serverError(error)
    // Assert
    expect(result).toEqual(result)
  })
})
