/* eslint-disable @typescript-eslint/unbound-method */
import { PgConnection } from '@/infrastructure/repositories/postgres/helpers'
import { PostgresDataSource } from '@/infrastructure/repositories/postgres/connection'

jest.mock('@/infrastructure/repositories/postgres/connection')

const PostgresDataSourceSpy = PostgresDataSource as jest.Mocked<typeof PostgresDataSource>
describe('PgConnection', () => {
  it('Should have only one instance', () => {
    const connection1 = PgConnection.getInstance()
    const connection2 = PgConnection.getInstance()

    expect(connection1).toBe(connection2)
  })

  it('Should create a new connection', async () => {
    const sut = PgConnection.getInstance()

    const initializeSpy = PostgresDataSourceSpy.initialize
    const createQueryRunnerSpy = PostgresDataSourceSpy.createQueryRunner

    await sut.connect()

    expect(initializeSpy).toHaveBeenCalledWith()
    expect(initializeSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})
