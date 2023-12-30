/* eslint-disable @typescript-eslint/unbound-method */
import { AxiosHttpClient } from '@/infrastructure/http'
import axios from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  it('Should call axios with correct values', async () => {
    const sut = new AxiosHttpClient()
    const fakeAxios = axios as jest.Mocked<typeof axios>

    await sut.get({
      url: 'any_url',
      params: {
        any: 'any_params'
      }
    })

    expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
      params: {
        any: 'any_params'
      }
    })
    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
  })
})
