/* eslint-disable @typescript-eslint/unbound-method */
import { AxiosHttpClient } from '@/infrastructure/http'
import axios from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object
  beforeAll(() => {
    url = 'any_url'
    params = { any: 'any_params' }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  it('Should call axios with correct values', async () => {
    await sut.get({ url, params })

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
  })
  it('Should return data on success', async () => {
    const result = await sut.get({ url, params })

    expect(result).toEqual('any_data')
  })
})
