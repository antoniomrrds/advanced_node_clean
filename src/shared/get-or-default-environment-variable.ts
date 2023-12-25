export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string
): string => {
  const value = process.env[environmentVariable]
  return value!
}
