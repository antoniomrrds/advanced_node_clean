import {
  CreateFacebookAccountRepository,
  LoadFacebookUserApi,
  LoadUserAccountRepository
} from '@/application/ports'
import { FacebookAuthenticationService } from '@/application/services'
import { AuthenticationError } from '@/domain/errors'
import { MockProxy, mock } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepo = mock()
    createFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo
    )
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })
  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email'
    })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
