export interface LoadUserProfile {
  load: (input: LoadUserProfile.Input) => Promise<LoadUserProfile.Output>
}
export namespace LoadUserProfile {
  export type Input = { id: string }
  export type Output = { name?: string }
}
