export interface LoadUserProfile {
  load: (input: LoadUserProfile.Input) => Promise<void>
}
export namespace LoadUserProfile {
  export type Input = {
    id: string
  }
}
