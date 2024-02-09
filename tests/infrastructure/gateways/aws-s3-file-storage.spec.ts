import { AwsS3FileStorage } from '@/infrastructure/gateways'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

jest.mock('@aws-sdk/client-s3')

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let bucket: string
  let fileName: string
  let sut: AwsS3FileStorage
  let file: Buffer
  let putObjectCommandSpy: jest.SpyInstance
  let deleteObjectCommandSpy: jest.SpyInstance

  beforeEach(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
    fileName = 'any_file_name'
    file = Buffer.from('any_buffer')
    sut = new AwsS3FileStorage(accessKey, secret, bucket)
    putObjectCommandSpy = jest.spyOn(S3Client.prototype, 'send')
    deleteObjectCommandSpy = jest.spyOn(S3Client.prototype, 'send')
  })

  it('Should call putObject with correct input on upload', async () => {
    await sut.upload({ fileName, file })

    expect(putObjectCommandSpy).toHaveBeenCalledWith(
      expect.any(PutObjectCommand)
    )
    expect(putObjectCommandSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return image URL on upload', async () => {
    const imageUrl = await sut.upload({ fileName, file })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${encodeURIComponent(fileName)}`)
  })

  it('Should return encoded image URL on upload', async () => {
    const imageUrl = await sut.upload({ fileName: 'any_file_name with spaces', file })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any_file_name%20with%20spaces`)
  })

  it('Should rethrow if putObject throws on upload', async () => {
    const error = new Error('upload_error')
    putObjectCommandSpy.mockRejectedValueOnce(error)

    await expect(sut.upload({ fileName, file })).rejects.toThrow(error)
  })

  it('Should call deleteObject with correct input on delete', async () => {
    await sut.delete({ fileName })

    expect(deleteObjectCommandSpy).toHaveBeenCalledWith(
      expect.any(DeleteObjectCommand)
    )
    expect(deleteObjectCommandSpy).toHaveBeenCalledTimes(1)
  })

  it('Should rethrow if deleteObject throws on delete', async () => {
    const error = new Error('delete_error')
    deleteObjectCommandSpy.mockRejectedValueOnce(error)

    await expect(sut.delete({ fileName })).rejects.toThrow(error)
  })
})
