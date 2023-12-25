/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { EnvironmentVariableError } from '@/shared/errors'

export type EnvironmentVariableGetter = string | Error | undefined

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string,
  defaultValue?: string
): EnvironmentVariableGetter => {
  const value = process.env[environmentVariable]
  return (
    value ||
    (defaultValue || new EnvironmentVariableError(environmentVariable))
  )
}
