import {
  ClientIdSecret,
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
    getClientIdAndSecretFromStorage(),
    Effect.flatMap((params) => requestAccessToken(params))
  )

  const exit = await Effect.runPromiseExit(token)

  return exit
}

export function getClientIdAndSecretFromStorage(): Effect.Effect<
  ClientIdSecret,
  null
> {
  const clientId = localStorage.getItem('clientId')
  const clientSecret = localStorage.getItem('clientSecret')

  if (clientId !== null && clientSecret !== null) {
    return Effect.succeed({
      clientId,
      clientSecret,
    })
  } else {
    return Effect.fail(null)
  }
}

function requestAccessToken(params: ClientIdSecret) {
  return Effect.tryPromise(() =>
    axios
      .post<HomeConnectOAuthTokenResponse>(
        'https://simulator.home-connect.com/security/oauth/token',
        {
          ...params,
          redirect_uri: 'http://localhost:5173/octopus-rates-client/',
        }
      )
      .then((response) => response.data)
  )
}
