/* eslint-disable @typescript-eslint/dot-notation */
import { TransactionNotFoundError, ConnectionNotFoundError, PgConnection, PgUser } from '@/infrastructure/repositories/postgres'
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

jest.mock('@/infrastructure/repositories/postgres/config', () => ({
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
  let shouldRunAfterEach: boolean
  let dataSourceSpy: jest.Mock
  let dataSourceOptionsMock: DataSourceOptions
  let isInitializedSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let getQueryRepositorySpy: jest.Mock
  let getRepositorySpy: jest.Mock
  const initializeSpy = jest.fn()
  const destroySpy = jest.fn()
  const startTransactionSpy = jest.fn()
  const releaseSpy = jest.fn()
  const commitTransactionSpy = jest.fn()
  const rollbackTransactionSpy = jest.fn()

  beforeAll(() => {
    dataSourceOptionsMock = getDataSourceOptions()
    getRepositorySpy = jest.fn().mockReturnValue('any_repository')
    getQueryRepositorySpy = jest.fn().mockReturnValue('any_query_repository')
    isInitializedSpy = jest.fn().mockReturnValue(false)
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy,
      rollbackTransaction: rollbackTransactionSpy,
      manager: {
        getRepository: getQueryRepositorySpy
      }
    })
    dataSourceSpy = jest.fn().mockReturnValue({
      isInitialized: isInitializedSpy,
      initialize: initializeSpy,
      createQueryRunner: createQueryRunnerSpy,
      destroy: destroySpy,
      getRepository: getRepositorySpy
    })
    mocked(DataSource).mockImplementation(dataSourceSpy)
  })

  beforeEach(() => {
    sut = PgConnection.getInstance()
    shouldRunAfterEach = true
  })

  afterEach(async () => {
    sut['connection'] && shouldRunAfterEach && await sut.disconnect()
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

    shouldRunAfterEach = false
  })
  it('Should use an existing connection', async () => {
    isInitializedSpy.mockReturnValue(true)

    await sut.connect()

    expect(initializeSpy).not.toHaveBeenCalled()
    expect(initializeSpy).not.toHaveBeenCalledWith()
  })
  it('Should set connection', () => {
    const dataSourceSpy = new DataSource(dataSourceOptionsMock)
    const setConnectionSpy = jest.spyOn(sut, 'setConnection')

    sut.setConnection(dataSourceSpy)

    expect(sut['connection']).toBeDefined()
    expect(setConnectionSpy).toHaveBeenCalledWith(dataSourceSpy)
    expect(setConnectionSpy).toHaveBeenCalled()
  })
  it('Should disconnect', async () => {
    await sut.connect()
    await sut.disconnect()

    expect(destroySpy).toHaveBeenCalledWith()
    expect(destroySpy).toHaveBeenCalled()
  })
  it('Should throw ConnectionNotFoundError on disconnect if connection is not found', async () => {
    const promise = sut.disconnect()

    expect(sut['connection']).toBeUndefined()
    expect(destroySpy).not.toHaveBeenCalled()
    expect(destroySpy).not.toHaveBeenCalledWith()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
  it('Should open transaction', async () => {
    await sut.connect()
    await sut.openTransaction()

    expect(startTransactionSpy).toHaveBeenCalledWith()
    expect(startTransactionSpy).toHaveBeenCalled()
    expect(createQueryRunnerSpy).toHaveBeenCalled()
    expect(createQueryRunnerSpy).toHaveBeenCalled()
  })
  it('Should throw ConnectionNotFoundError on open transaction if connection is not found', async () => {
    const promise = sut.openTransaction()

    expect(sut['connection']).toBeUndefined()
    expect(startTransactionSpy).not.toHaveBeenCalled()
    expect(startTransactionSpy).not.toHaveBeenCalledWith()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
  it('Should get repository', async () => {
    await sut.connect()
    const repository = sut.getRepository(PgUser)

    expect(getRepositorySpy).toHaveBeenCalledWith(PgUser)
    expect(getRepositorySpy).toHaveBeenCalled()
    expect(repository).toBe('any_repository')
  })
  it('Should throw ConnectionNotFoundError on get repository if connection is not found', async () => {
    expect(getRepositorySpy).not.toHaveBeenCalled()
    expect(() => sut.getRepository(PgUser)).toThrow(new ConnectionNotFoundError())
  })
  it('Should get repository from transaction', async () => {
    await sut.connect()
    await sut.openTransaction()
    const repository = sut.getRepository(PgUser)

    expect(getQueryRepositorySpy).toHaveBeenCalledWith(PgUser)
    expect(getQueryRepositorySpy).toHaveBeenCalled()
    expect(repository).toBe('any_query_repository')
  })

  type DynamicMethod = 'closeTransaction' | 'commitTransaction' | 'rollbackTransaction'
  type TestData = { method: DynamicMethod, spy: jest.Mock, name: string }

  const testCases: TestData [] = [
    { method: 'closeTransaction', spy: releaseSpy, name: 'close transaction' },
    { method: 'commitTransaction', spy: commitTransactionSpy, name: 'commit transaction' },
    { method: 'rollbackTransaction', spy: rollbackTransactionSpy, name: 'rollback transaction' }
  ]

  testCases.forEach(({ method, spy, name }) => {
    it(`Should ${name}`, async () => {
      await sut.connect()
      await sut.openTransaction()
      await (sut[method] as jest.Mock)()

      expect(spy).toHaveBeenCalledWith()
      expect(spy).toHaveBeenCalled()
    })
    it(`Should throw TransactionNotFoundError on ${name} if queryRunner is not found`, async () => {
      const promise = (sut[method] as jest.Mock)()

      expect(sut['query']).toBeUndefined()
      expect(sut['connection']).toBeUndefined()
      expect(spy).not.toHaveBeenCalled()
      expect(spy).not.toHaveBeenCalledWith()
      await expect(promise).rejects.toThrow(new TransactionNotFoundError())
    })
  })
})
