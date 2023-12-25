export type EnvironmentVariableGetter = string

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string
): EnvironmentVariableGetter => {
  const value = process.env[environmentVariable]
  return value!
}
