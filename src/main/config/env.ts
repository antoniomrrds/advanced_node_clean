import { getEnvironmentVariableOrDefault as getEnvVarOrDefault } from '@/shared'

export const { facebookApi, userFacebookApi } = {
  facebookApi: {
    clientId: getEnvVarOrDefault('FB_CLIENT_ID', process.env.FB_CLIENT_ID_TEST),
    clientSecret: getEnvVarOrDefault('FB_CLIENT_SECRET', process.env.FB_CLIENT_SECRET_TEST)
  },
  userFacebookApi: {
    facebookId: getEnvVarOrDefault('FB_USER_ID', 'user_test_id'),
    name: getEnvVarOrDefault('FB_USER_NAME', 'user_test_name'),
    email: getEnvVarOrDefault('FB_USER_EMAIL', 'user_test_email'),
    token: getEnvVarOrDefault('FB_USER_TOKEN', 'user_test_token')
  }
}
