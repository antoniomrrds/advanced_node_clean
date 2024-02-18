/* eslint-disable @typescript-eslint/unbound-method */
import { DbTransactionController } from '@/presentation/decorators'
import { DbTransaction } from '@/presentation/ports'
import { Controller } from '@/presentation/controllers'

import { MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionControllerDecorator', () => {
  let db: MockProxy<DbTransaction>
  let sut: DbTransactionController
  let decoratee: MockProxy<Controller>

  beforeAll(() => {
    db = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 200, body: 'any' })
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  it('Should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('Should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalled()
    expect(db.openTransaction).toHaveBeenCalledWith()
  })
  it('Should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalled()
    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
  })
  it('Should call commitTransaction and close transaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.closeTransaction).toHaveBeenCalled()
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.rollbackTransaction).not.toHaveBeenCalled()
    expect(db.commitTransaction).toHaveBeenCalled()
    expect(db.commitTransaction).toHaveBeenCalledWith()
  })
  it('Should call rollbackTransaction and close transaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee_error'))

    await sut.perform({ any: 'any' }).catch(() => {
      expect(db.commitTransaction).not.toHaveBeenCalled()
      expect(db.rollbackTransaction).toHaveBeenCalled()
      expect(db.rollbackTransaction).toHaveBeenCalledWith()
      expect(db.closeTransaction).toHaveBeenCalled()
      expect(db.closeTransaction).toHaveBeenCalledWith()
    })
  })
  it('Should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: 'any'
    })
  })
  it('Should rethrow error if decoratee throws', async () => {
    const error = new Error('decoratee_error')
    decoratee.perform.mockRejectedValueOnce(error)

    const promise = sut.perform({ any: 'any' })

    await expect(promise).rejects.toThrow(error)
  })
})
