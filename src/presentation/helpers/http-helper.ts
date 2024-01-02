import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { HttpResponse } from '@/presentation/ports'

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  body: data
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (error: unknown): HttpResponse<Error> => ({
  statusCode: 500,
  body: new ServerError(error instanceof Error ? error : undefined)
})
