export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>
}

export namespace TokenValidator {
  export type Params = { token: string }
}
