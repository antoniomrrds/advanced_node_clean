import { AwsS3FileStorage } from '@/infrastructure/gateways'
import { s3 } from '@/main/config/env'

export const makeAwsS3FileStorage = (): AwsS3FileStorage => {
  return new AwsS3FileStorage(s3.accessKey, s3.secret, s3.bucket)
}
