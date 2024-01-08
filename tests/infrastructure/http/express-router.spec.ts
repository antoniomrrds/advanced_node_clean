import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/presentation/controllers'
import { mock } from 'jest-mock-extended'
import { ExpressRouterAdapter } from '@/infrastructure/http'

describe('ExpressRouterAdapter', () => {
  it('Should call handle with correct request', async () => {
    const req = getMockReq({ body: { any: 'any' } })
    const { res } = getMockRes()
    const controller = mock<Controller>()
    const sut = new ExpressRouterAdapter(controller)
    await sut.adapt(req, res)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })
  
})
