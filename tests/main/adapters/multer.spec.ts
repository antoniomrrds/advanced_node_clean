import { adaptMulter } from '@/main/adapters'
import { mocked } from 'jest-mock'
import { getMockReq, getMockRes } from '@jest-mock/express'

import multer from 'multer'

jest.mock('multer')

describe('MulterAdapter', () => {
  it('Should call single upload with correct input', () => {
    const uploadSpy = jest.fn()
    const singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    const multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    const fakeMulter = multer as jest.MockedFunction<typeof multer>
    mocked(fakeMulter).mockImplementation(multerSpy)
    const req = getMockReq()
    const res = getMockRes().res
    const next = getMockRes().next
    const sut = adaptMulter

    sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})
