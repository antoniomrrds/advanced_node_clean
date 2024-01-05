import { EnvironmentVariableError } from '@/shared/errors'

export type EnvironmentVariableGetter = string

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string,
  defaultValue?: string
): EnvironmentVariableGetter => {
  const value = process.env[environmentVariable]
  const isValueEmpty = ['', undefined].includes(value)
  if (isValueEmpty && defaultValue) return defaultValue
  if (!isValueEmpty && value) return value

  throw new EnvironmentVariableError(environmentVariable)
}
