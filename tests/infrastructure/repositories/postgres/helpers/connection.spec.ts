/* eslint-disable @typescript-eslint/dot-notation */
import { ConnectionNotFoundError, PgConnection } from '@/infrastructure/repositories/postgres'
import { mocked } from 'jest-mock'
import { DataSource, DataSourceOptions } from 'typeorm'

function getDataSourceOptions (): DataSourceOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'database',
    entities: ['any-path']
  }
}

jest.mock('@/infrastructure/repositories/postgres/connection', () => ({
  dataSourceOptions: getDataSourceOptions()
}))

jest.mock('typeorm', () => ({
  DataSource: jest.fn(),
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn()
}))

describe('PgConnection', () => {
  let sut: PgConnection
  let dataSourceSpy: jest.Mock
  let dataSourceOptionsMock: DataSourceOptions
  let isInitializedSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  const initializeSpy = jest.fn()
  const destroySpy = jest.fn()
  const startTransactionSpy = jest.fn()
  const releaseSpy = jest.fn()
  const commitTransactionSpy = jest.fn()
  const rollbackTransactionSpy = jest.fn()

  beforeAll(() => {
    dataSourceOptionsMock = getDataSourceOptions()
    isInitializedSpy = jest.fn().mockReturnValue(false)
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy,
      rollbackTransaction: rollbackTransactionSpy
    })
    dataSourceSpy = jest.fn().mockReturnValue({
      isInitialized: isInitializedSpy,
      initialize: initializeSpy,
      createQueryRunner: createQueryRunnerSpy,
      destroy: destroySpy
    })
    mocked(DataSource).mockImplementation(dataSourceSpy)
  })

  beforeEach(() => {
    sut = PgConnection.getInstance()
  })

  it('Should have only one instance', () => {
    const connection2 = PgConnection.getInstance()
    expect(sut).toBe(connection2)
  })
  it('Should not have a connection before connect is called', () => {
    expect(sut['connection']).toBeUndefined()
  })
  it('Should create a new connection', async () => {
    await sut.connect()

    expect(initializeSpy).toHaveBeenCalledTimes(1)
    expect(initializeSpy).toHaveBeenCalled()
    expect(dataSourceSpy).toHaveBeenCalledWith(dataSourceOptionsMock)
    expect(dataSourceSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalled()
  })
  it('Should use an existing connection', async () => {
    isInitializedSpy.mockReturnValue(true)

    await sut.connect()

    expect(initializeSpy).not.toHaveBeenCalled()
    expect(initializeSpy).not.toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalled()
  })

  type DynamicMethod = 'openTransaction' | 'closeTransaction' | 'commitTransaction' | 'rollbackTransaction' | 'disconnect'
  type TestData = { method: DynamicMethod, spy: jest.Mock, name: string }

  const testCases: TestData [] = [
    { method: 'disconnect', spy: destroySpy, name: 'disconnect' },
    { method: 'openTransaction', spy: startTransactionSpy, name: 'open transaction' },
    { method: 'closeTransaction', spy: releaseSpy, name: 'close transaction' },
    { method: 'commitTransaction', spy: commitTransactionSpy, name: 'commit transaction' },
    { method: 'rollbackTransaction', spy: rollbackTransactionSpy, name: 'rollback transaction' }
  ]

  describe.each(testCases)('Transaction and disconnect', ({ method, spy, name }) => {
    it(`Should ${name}`, async () => {
      await sut.connect()
      await (sut[method] as jest.Mock)()

      expect(spy).toHaveBeenCalledWith()
      expect(spy).toHaveBeenCalled()

      method !== 'disconnect' && await sut.disconnect()
    })
    it(`Should return ConnectionNotFoundError on ${name} if connection is not found`, async () => {
      const promise = (sut[method] as jest.Mock)()

      expect(sut['query']).toBeUndefined()
      expect(sut['connection']).toBeUndefined()
      expect(spy).not.toHaveBeenCalled()
      expect(spy).not.toHaveBeenCalledWith()
      await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
    })
  })
})
