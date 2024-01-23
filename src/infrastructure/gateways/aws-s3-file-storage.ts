import { config } from 'aws-sdk'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AwsS3FileStorage {
  constructor (accessKeyId: string, secret: string) {
    config.update({
      credentials: {
        accessKeyId,
        secretAccessKey: secret
      }
    })
  }
}
