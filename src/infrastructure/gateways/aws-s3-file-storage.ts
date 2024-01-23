import { UploadFile } from '@/domain/ports'
import { S3, config } from 'aws-sdk'

export class AwsS3FileStorage {
  constructor (accessKeyId: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId,
        secretAccessKey: secret
      }
    })
  }

  async upload ({ key, file }: UploadFile.Input): Promise<void> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
  }
}
