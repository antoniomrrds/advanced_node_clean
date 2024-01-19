import { AxiosHttpClient } from '@/infrastructure/gateways'

export const makeAxiosHttpClient = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}
