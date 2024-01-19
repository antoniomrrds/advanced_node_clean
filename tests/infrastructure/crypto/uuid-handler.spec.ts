import { UUIDHandler } from '@/infrastructure/crypto'
import { v4 } from 'uuid'

jest.mock('uuid')

describe('UUIDHandler', () => {
  it('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
