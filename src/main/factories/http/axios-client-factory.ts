import { AxiosHttpClient } from '@/infrastructure/http'

export const makeAxiosHttpClient = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}
