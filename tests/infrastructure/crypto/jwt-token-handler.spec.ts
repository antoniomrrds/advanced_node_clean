import { JwtTokenHandler } from '@/infrastructure/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number
    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token)
    })
    it('Should call sign with correct values', async () => {
      await sut.generateToken({ key, expirationInMs })
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })
    it('Should return a token on sign success', async () => {
      const generateToken = await sut.generateToken({ key, expirationInMs })

      expect(generateToken).toBe(token)
    })
    it('Should rethrow if sign throws', async () => {
      const error = new Error('token_error')
      fakeJwt.sign.mockImplementationOnce(() => { throw error })

      const promise = sut.generateToken({ key, expirationInMs })

      await expect(promise).rejects.toThrow(error)
    })
  })
  describe('validateToken', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })
    it('Should call verify with correct values', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })
    it('Should return the key used to sign', async () => {
      const genetateKey = await sut.validateToken({ token })

      expect(genetateKey).toBe(key)
    })
  })
})
