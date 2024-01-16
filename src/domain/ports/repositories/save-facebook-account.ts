export interface SaveFacebookAccount {
  saveWithFacebook: (input: SaveFacebookAccount.Input) => Promise<SaveFacebookAccount.Output>
}
export namespace SaveFacebookAccount {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
  }
  export type Output = {
    id: string
  }
}
