import { PgConnection } from '@/infrastructure/repositories/postgres/helpers'

describe('PgConnection', () => {
  it('Should have only one instance', () => {
    const connection1 = PgConnection.getInstance()
    const connection2 = PgConnection.getInstance()

    expect(connection1).toBe(connection2)
  })
})
