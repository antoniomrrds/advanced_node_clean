/* eslint-disable @typescript-eslint/unbound-method */
import { AwsS3FileStorage } from '@/infrastructure/gateways'
import { config, S3 } from 'aws-sdk'
import { mocked } from 'jest-mock'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let bucket: string
  let key: string
  let sut: AwsS3FileStorage

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
    key = 'any_key'
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket)
  })

  it('Should config aws credentials on creation', () => {
    expect(sut).toBeTruthy()

    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })

  describe('upload', () => {
    let file: Buffer
    let putObjectSpy: jest.Mock
    let putObjectPromiseSpy: jest.Mock

    beforeAll(() => {
      file = Buffer.from('any_buffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
    })

    it('Should call putObject with correct input', async () => {
      await sut.upload({ key, file })

      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key,
        Body: file,
        ACL: 'public-read'
      })
      expect(putObjectSpy).toHaveBeenCalledTimes(1)
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })
    it('Should return image url', async () => {
      const imageUrl = await sut.upload({ key, file })

      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
    })
    it('Should return encoded image url', async () => {
      const imageUrl = await sut.upload({ key: 'any_key with spaces', file })

      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any_key%20with%20spaces`)
    })
    it('Should rethrow if putObject throws', async () => {
      const error = new Error('upload_error')
      putObjectPromiseSpy.mockRejectedValueOnce(error)

      const promise = sut.upload({ key, file })

      await expect(promise).rejects.toThrow(error)
    })
  })

  describe('delete', () => {
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    it('Should call deleteObject with correct input', async () => {
      await sut.delete({ key })

      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key
      })
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })
  })
})
