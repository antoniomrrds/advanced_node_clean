import { UUIDHandler, UniqueId } from '@/infrastructure/gateways'

export const makeUUIDHandler = (): UUIDHandler => {
  return new UUIDHandler()
}

export const makeUniqueId = (): UniqueId => {
  return new UniqueId(new Date())
}
