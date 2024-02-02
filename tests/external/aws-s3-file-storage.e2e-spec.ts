import { AwsS3FileStorage } from '@/infrastructure/gateways'
import { s3 } from '@/main/config/env'
import axios from 'axios'

describe('Aws S3 Integration Tests', () => {
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(
      s3.accessKey,
      s3.secret,
      s3.bucket
    )
  })

  it('Should upload and delete image from aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjUI/7/h8ABKgCfHqSDO0AAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const key = 'any_key.png'

    const pictureUrl = await sut.upload({ key, file })

    expect((await axios.get(pictureUrl)).status).toBe(200)

    await sut.delete({ key })
    expect(await axios.get(pictureUrl)).rejects.toThrow()
  })
})
