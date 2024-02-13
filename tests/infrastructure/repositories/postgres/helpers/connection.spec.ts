import { PgConnection } from '@/infrastructure/repositories/postgres/helpers'
import { mocked } from 'jest-mock'
import { DataSource, DataSourceOptions } from 'typeorm'

jest.mock('@/infrastructure/repositories/postgres/connection', () => ({
  dataSourceOptions: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'database',
    entities: ['any-path']
  }
}))

jest.mock('typeorm', () => ({
  DataSource: jest.fn(),
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn()
}))

class MockDataSource extends DataSource {
  isInitialized = false

  initialize = jest.fn()
  createQueryRunner = jest.fn()
}

describe('PgConnection', () => {
  let sut: PgConnection
  let dataSourceSpy: jest.Mock
  let mockDataSourceSpy: MockDataSource
  const dataSourceOptionsMock: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'database',
    entities: ['any-path']
  }

  beforeAll(() => {
    const mockDataSource = new MockDataSource(dataSourceOptionsMock)
    dataSourceSpy = jest.fn().mockReturnValue(mockDataSource)
    mocked(DataSource).mockImplementation(dataSourceSpy)

    mockDataSourceSpy = mockDataSource
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

    expect(mockDataSourceSpy.initialize).toHaveBeenCalledTimes(1)
    expect(dataSourceSpy).toHaveBeenCalledWith(dataSourceOptionsMock)
    expect(dataSourceSpy).toHaveBeenCalledTimes(1)
    expect(mockDataSourceSpy.createQueryRunner).toHaveBeenCalledWith()
    expect(mockDataSourceSpy.createQueryRunner).toHaveBeenCalledTimes(1)
  })

  it('Should use an existing connection', async () => {
    mockDataSourceSpy.isInitialized = true

    await sut.connect()

    expect(mockDataSourceSpy.initialize).not.toHaveBeenCalled()
    expect(mockDataSourceSpy.createQueryRunner).toHaveBeenCalledWith()
    expect(mockDataSourceSpy.createQueryRunner).toHaveBeenCalledTimes(1)
  })
})
