/* eslint-disable @typescript-eslint/unbound-method */
import { PgConnection } from '@/infrastructure/repositories/postgres/helpers'
import { PostgresDataSource } from '@/infrastructure/repositories/postgres/connection'

jest.mock('@/infrastructure/repositories/postgres/connection')

describe('PgConnection', () => {
  let PostgresDataSourceSpy: jest.Mocked<typeof PostgresDataSource>
  let sut: PgConnection
  let initializeSpy: jest.SpyInstance
  let createQueryRunnerSpy: jest.SpyInstance

  beforeAll(() => {
    PostgresDataSourceSpy = PostgresDataSource as jest.Mocked<typeof PostgresDataSource>
    initializeSpy = PostgresDataSourceSpy.initialize
    createQueryRunnerSpy = PostgresDataSourceSpy.createQueryRunner
  })

  beforeEach(() => {
    sut = PgConnection.getInstance()
  })

  it('Should have only one instance', () => {
    const connection2 = PgConnection.getInstance()

    expect(sut).toBe(connection2)
  })

  it('Should create a new connection', async () => {
    await sut.connect()

    expect(initializeSpy).toHaveBeenCalledWith()
    expect(initializeSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})
