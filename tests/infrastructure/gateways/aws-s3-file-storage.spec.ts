/* eslint-disable @typescript-eslint/unbound-method */
import { AwsS3FileStorage } from '@/infrastructure/gateways'
import { config } from 'aws-sdk'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  it('Should config aws credentials on creation', () => {
    const accessKey = 'any_access_key'
    const secret = 'any_secret'

    const sut = new AwsS3FileStorage(accessKey, secret)
    expect(sut).toBeTruthy()

    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
