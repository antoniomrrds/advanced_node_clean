import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/presentation/controllers'
import { mock, MockProxy } from 'jest-mock-extended'
import { ExpressRouterAdapter } from '@/infrastructure/http'
import { Request, Response } from 'express'

describe('ExpressRouterAdapter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouterAdapter

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
    sut = new ExpressRouterAdapter(controller)
  })
  it('Should call handle with correct request', async () => {
    await sut.adapt(req, res)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })
  it('Should call handle with empty request', async () => {
    const req = getMockReq()

    await sut.adapt(req, res)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
