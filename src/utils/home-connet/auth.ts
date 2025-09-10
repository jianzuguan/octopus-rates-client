import { config } from '@/config/env'
import {
  HomeConnectCredentials,
  HomeConnectOAuthTokenResponse,
  HomeConnectRefreshAccessTokenParams,
} from '@/types/HomeConnect'
import axios from 'axios'
import { Effect } from 'effect'

// Home Connect OAuth scopes for dishwasher monitoring and control
const DISHWASHER_SCOPES = [
  'IdentifyAppliance',
  'Dishwasher-Monitor',
  'Dishwasher-Control',
  'Dishwasher-Settings',
].join('%20')

/**
 * Navigates to the Home Connect OAuth authorization URL to get an authorization code
 * @param clientId - The client ID for the Home Connect application
 * @returns The authorization URL that the user will be redirected to
 */
export function navigateToHomeConnectAuth(clientId: string): string {
  const searchParams = [
    `client_id=${clientId}`,
    `redirect_uri=${encodeURI(config.redirectUri)}`,
    `response_type=code`,
    `scope=${DISHWASHER_SCOPES}`,
  ]
  const urlString = `${config.homeConnect.oauthUrl}/authorize?${searchParams.join('&')}`

  console.log(`Navigating to Home Connect Auth: ${urlString}`)

  // Navigate to the authorization URL
  window.location.href = urlString

  return urlString
}

export function requestAccessToken(params: HomeConnectCredentials) {
  return Effect.tryPromise(() =>
    axios
      .post<HomeConnectOAuthTokenResponse>(
        `${config.homeConnect.oauthUrl}/token`,
        {
          grant_type: 'authorization_code',
          code: params.authCode,
          redirect_uri: config.redirectUri,
          client_id: params.clientId,
          client_secret: params.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      )
      .then((response) => response.data)
  )
}

export function refreshAccessToken({
  clientId,
  clientSecret,
  refreshToken,
}: HomeConnectRefreshAccessTokenParams) {
  return Effect.tryPromise(() =>
    axios
      .post<HomeConnectOAuthTokenResponse>(
        `${config.homeConnect.oauthUrl}/token`,
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      )
      .then((response) => response.data)
  )
}

export function storeAccessToken(token: HomeConnectOAuthTokenResponse) {
  console.log(`Storing token: ${JSON.stringify(token)}`)
  localStorage.setItem('accessToken', token.access_token)
  localStorage.setItem('refreshToken', token.refresh_token)
  localStorage.setItem('expiresIn', token.expires_in.toString())

  return token
}

export function retrieveClientCredentialsFromStorage(
  authCode: string
): Effect.Effect<HomeConnectCredentials, null> {
  const clientId = localStorage.getItem('clientId')
  const clientSecret = localStorage.getItem('clientSecret')

  if (clientId !== null && clientSecret !== null) {
    return Effect.succeed({
      clientId,
      clientSecret,
      authCode,
    })
  } else {
    return Effect.fail(null)
  }
}

export function retrieveRefreshCredentialsFromStorage(): Effect.Effect<
  HomeConnectRefreshAccessTokenParams,
  null
> {
  const clientId = localStorage.getItem('clientId')
  const clientSecret = localStorage.getItem('clientSecret')
  const refreshToken = localStorage.getItem('refreshToken')

  if (clientId !== null && clientSecret !== null && refreshToken !== null) {
    return Effect.succeed({
      clientId,
      clientSecret,
      refreshToken,
    })
  } else {
    return Effect.fail(null)
  }
}
