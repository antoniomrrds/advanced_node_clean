import { HttpGetClient } from '@/infrastructure/http'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get ({ url, params }: HttpGetClient.Params): Promise<any> {
    const { data } = await axios.get(url, { params })
    return data
  }
}
