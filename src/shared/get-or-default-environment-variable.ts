export type EnvironmentVariableGetter = string

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string,
  defaultValue?: string
): EnvironmentVariableGetter => {
  const value = process.env[environmentVariable] ?? defaultValue
  return value!
}
