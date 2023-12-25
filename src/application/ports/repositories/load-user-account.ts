export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}
namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = undefined | {
    id: string
    name?: string
  }
}
