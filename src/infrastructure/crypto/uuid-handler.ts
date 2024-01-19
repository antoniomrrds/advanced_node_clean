import { UUIDGenerator } from '@/domain/ports'

import { v4 } from 'uuid'

export class UUIDHandler {
  uuid ({ key }: UUIDGenerator.Input): void {
    v4()
  }
}
