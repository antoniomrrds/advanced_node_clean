import { DbTransactionControllerDecorator } from '@/presentation/decorators'
import { DBTransaction } from '@/presentation/ports'
import { mock } from 'jest-mock-extended'

describe('DbTransactionControllerDecorator', () => {
  it('Should open transaction', async () => {
    const db = mock<DBTransaction>()
    const sut = new DbTransactionControllerDecorator(db)

    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalled()
    expect(db.openTransaction).toHaveBeenCalledWith()
  })
})
