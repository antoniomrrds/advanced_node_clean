/* eslint-disable @typescript-eslint/unbound-method */
import { DbTransactionControllerDecorator } from '@/presentation/decorators'
import { DBTransaction } from '@/presentation/ports'
import { Controller } from '@/presentation/controllers'

import { MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionControllerDecorator', () => {
  let db: MockProxy<DBTransaction>
  let sut: DbTransactionControllerDecorator
  let decoratee: MockProxy<Controller>

  beforeAll(() => {
    db = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 200, body: 'any' })
  })

  beforeEach(() => {
    sut = new DbTransactionControllerDecorator(decoratee, db)
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
  it('Should call commit and close transaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.closeTransaction).toHaveBeenCalled()
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.rollback).not.toHaveBeenCalled()
    expect(db.commit).toHaveBeenCalled()
    expect(db.commit).toHaveBeenCalledWith()
  })
  it('Should call roolback and close transaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee_error'))

    await sut.perform({ any: 'any' })

    expect(db.commit).not.toHaveBeenCalled()
    expect(db.rollback).toHaveBeenCalled()
    expect(db.rollback).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalled()
    expect(db.closeTransaction).toHaveBeenCalledWith()
  })
  it('Should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: 'any'
    })
  })
})
