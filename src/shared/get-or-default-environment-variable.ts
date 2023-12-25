import { EnvironmentVariableError } from '@/shared/errors'

export type EnvironmentVariableGetter = string | Error

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string,
  defaultValue?: string
): EnvironmentVariableGetter => {
  const value = process.env[environmentVariable] ?? defaultValue
  if (!value) return new EnvironmentVariableError(environmentVariable)
  return value
}
