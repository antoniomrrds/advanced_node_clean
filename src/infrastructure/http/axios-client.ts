import { HttpGetClient } from '@/infrastructure/http'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any> (args: HttpGetClient.Params): Promise<T> {
    const { data } = await axios.get(args.url, { params: args.params })
    return data
  }
}
