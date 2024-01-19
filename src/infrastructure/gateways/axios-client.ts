import { HttpGetClient } from '@/infrastructure/gateways'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get ({ url, params }: HttpGetClient.Input): Promise<any> {
    const { data } = await axios.get(url, { params })
    return data
  }
}
