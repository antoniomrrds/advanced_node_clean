import { UUIDGenerator } from '@/domain/ports'

export class UniqueId implements UUIDGenerator {
  uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const date = new Date()
    return key +
      '_' +
      date.getFullYear().toString().padStart(2, '0') +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0')
  }
}
