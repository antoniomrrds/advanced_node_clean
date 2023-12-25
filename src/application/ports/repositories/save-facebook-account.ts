export interface SaveFacebookAccountRepositry {
  saveWithFacebook: (params: SaveFacebookAccountRepositry.Params) => Promise<SaveFacebookAccountRepositry.Result>
}
export namespace SaveFacebookAccountRepositry {
  export type Params = {
    id?: string
    name: string
    email: string
    facebookId: string
  }
  export type Result = undefined
}
