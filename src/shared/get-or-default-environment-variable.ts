import { EnvironmentVariableError } from '@/shared/errors'

export type EnvironmentVariableGetter = string | Error | undefined

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string,
  defaultValue?: string
): EnvironmentVariableGetter => {
  const value = process.env[environmentVariable]
  if (!value && defaultValue) return defaultValue
  if (!value && !defaultValue) {
    return new EnvironmentVariableError(environmentVariable)
  }
  return value
}
