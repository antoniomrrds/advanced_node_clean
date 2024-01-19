import { UniqueId } from '@/infrastructure/gateways'

describe('UUIDHandler', () => {
  it('Should create a unique id', () => {
    const sut = new UniqueId(new Date(2024, 0, 3, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20240103101010')
  })
  it('Should create a unique id', () => {
    const sut = new UniqueId(new Date(1996, 9, 23, 18, 1, 0))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_19961023180100')
  })
})
