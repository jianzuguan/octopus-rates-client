export interface HomeConnectOAuthTokenRequest {
  client_id: string
  redirect_uri: string
  grant_type: 'authorization_code'
  code: string
}

export interface HomeConnectCredentials {
  clientId: string
  clientSecret: string
  authCode: string
}

export interface HomeConnectOAuthTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}

