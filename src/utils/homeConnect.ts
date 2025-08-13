import {
  HomeConnectCredentials,
  HomeConnectOAuthTokenResponse,
} from '@/types/HomeConnect'
import axios from 'axios'
import { Effect, pipe } from 'effect'

// Home Connect OAuth scopes for dishwasher monitoring and control
const DISHWASHER_SCOPES = ['Dishwasher-Monitor', 'Dishwasher-Control'].join(
  '%20'
)

export function getClientIdAndNavigate() {
  const clientId = localStorage.getItem('clientId')

  if (!clientId) {
    console.error('Client ID not found in local storage')
  } else {
    navigateToHomeConnectAuth(clientId)
  }
}

/**
 * Navigates to the Home Connect OAuth authorization URL to get an authorization code
 * @param clientId - The client ID for the Home Connect application
 * @returns The authorization URL that the user will be redirected to
 */
function navigateToHomeConnectAuth(clientId: string): string {
  const searchParams = [
    `client_id=${clientId}`,
    `redirect_uri=${encodeURI('http://localhost:5173/octopus-rates-client/')}`,
    `response_type=code`,
    `scope=${DISHWASHER_SCOPES}`,
  ]
  const urlString = `https://simulator.home-connect.com/security/oauth/authorize?${searchParams.join('&')}`

  console.log(`Navigating to Home Connect Auth: ${urlString}`)

  // Navigate to the authorization URL
  window.location.href = urlString

  return urlString
}

export async function getHomeConnectOAuthToken() {
  const token = pipe(
    retrieveClientCredentialsFromStorage(),
    Effect.flatMap((params) => requestAccessToken(params)),
    Effect.tap((res) => console.log(res))
  )

  const exit = await Effect.runPromiseExit(token)

  return exit
}

export function retrieveClientCredentialsFromStorage(): Effect.Effect<
  HomeConnectCredentials,
  null
> {
  const clientId = localStorage.getItem('clientId')
  const clientSecret = localStorage.getItem('clientSecret')
  const authCode = localStorage.getItem('homeConnectAuthCode')

  if (clientId !== null && clientSecret !== null && authCode !== null) {
    return Effect.succeed({
      clientId,
      clientSecret,
      authCode,
    })
  } else {
    return Effect.fail(null)
  }
}

function requestAccessToken(params: HomeConnectCredentials) {
  return Effect.tryPromise(() =>
    axios
      .post<HomeConnectOAuthTokenResponse>(
        'https://simulator.home-connect.com/security/oauth/token',
        {
          grant_type: 'authorization_code',
          code: params.authCode,
          // redirect_uri: 'http://localhost:5173/octopus-rates-client/',
          client_id: params.clientId,
          client_secret: params.clientSecret
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          }
        }
      )
      .then((response) => response.data)
  )
}
