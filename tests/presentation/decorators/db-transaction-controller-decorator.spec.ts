import { DbTransactionControllerDecorator } from '@/presentation/decorators'
import { DBTransaction } from '@/presentation/ports'
import { MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionControllerDecorator', () => {
  let db: MockProxy<DBTransaction>
  let sut: DbTransactionControllerDecorator

  beforeAll(() => {
    db = mock()
  })

  beforeEach(() => {
    sut = new DbTransactionControllerDecorator(db)
  })

  it('Should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalled()
    expect(db.openTransaction).toHaveBeenCalledWith()
  })
})
