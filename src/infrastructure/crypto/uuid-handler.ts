import { UUIDGenerator } from '@/domain/ports'

import { v4 } from 'uuid'

export class UUIDHandler {
  uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}
