import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile
  beforeEach(() => {
    sut = new UserProfile('any_id')
  })
  it('Should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({ id: 'any_id', pictureUrl: 'any_url', initials: undefined })
  })
  it('Should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })

    expect(sut).toEqual({ id: 'any_id', pictureUrl: 'any_url', initials: undefined })
  })
  it('Should create initials with first and last letter of name', () => {
    sut.setPicture({ name: 'antonio mark rr soares' })

    expect(sut).toEqual({ id: 'any_id', initials: 'AS', pictureUrl: undefined })
  })
  it('Should create initials with first and last letter of name when name has only one word', () => {
    sut.setPicture({ name: 'antonio' })

    expect(sut).toEqual({ id: 'any_id', initials: 'AN', pictureUrl: undefined })
  })
  it('Should create initials with first letter of name when name has only one letter', () => {
    sut.setPicture({ name: 'a' })

    expect(sut).toEqual({ id: 'any_id', initials: 'A', pictureUrl: undefined })
  })
  it('Should create initials empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({ })

    expect(sut).toEqual({ id: 'any_id', initials: undefined, pictureUrl: undefined })
  })
  it('Should create initials empty initials when name is an string empty', () => {
    sut.setPicture({ name: '' })

    expect(sut).toEqual({ id: 'any_id', initials: undefined, pictureUrl: undefined })
  })
})
