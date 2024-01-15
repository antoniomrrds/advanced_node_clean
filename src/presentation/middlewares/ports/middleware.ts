import { HttpResponse } from '@/presentation/ports'

export interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
