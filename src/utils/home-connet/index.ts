import {
  GetHomeConnectApplianceResponse,
  GetHomeConnectStatusDoorResponse,
  HomeConnectAppliance,
  HomeConnectCredentials,
  HomeConnectOAuthTokenResponse,
} from '@/types/HomeConnect'
import axios from 'axios'
import { Effect, Exit, pipe } from 'effect'
import { UnknownException } from 'effect/Cause'
import { getAvailablePrograms } from './getAvailabePrograms'
import { getOperationState } from './getOperationState'
import { getSelectedProgramOptions } from './getSelectedProgramOptions'
import { setActiveProgram } from './setActiveProgram'
import { setDelayStart } from './setDelayStart'
import { setPowerOn } from './setPowerOn'
import { setSelectedProgram } from './setSeletedProgram'

// Home Connect OAuth scopes for dishwasher monitoring and control
const DISHWASHER_SCOPES = [
  'IdentifyAppliance',
  'Dishwasher-Monitor',
  'Dishwasher-Control',
  'Dishwasher-Settings',
].join('%20')

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

export async function getHomeConnectOAuthToken(authCode: string) {
  const token = pipe(
    retrieveClientCredentialsFromStorage(authCode),
    // Effect.tap((params) => console.log(`params: ${JSON.stringify(params)}`)),
    Effect.flatMap((params) => requestAccessToken(params)),
    // Effect.tap((res) => console.log(`res: ${JSON.stringify(res)}`))
    Effect.map(storeAccessToken)
  )

  const exit = await Effect.runPromiseExit(token)

  console.log(
    Exit.match(exit, {
      onSuccess: (value) =>
        `Home Connect OAuth Token: ${JSON.stringify(value)}`,
      onFailure: (error) =>
        `Home Connect OAuth Token Error: ${JSON.stringify(error)}`,
    })
  )

  return exit
}

export function getDishwasherHaId() {
  const haId = pipe(
    getAllAppliances(),
    // Effect.tap((appliances) =>
    //   console.log(`Retrieved appliances: ${JSON.stringify(appliances)}`)
    // ),
    Effect.flatMap(getDishWasher),
    // Effect.tap((dishwasher) => {
    //   console.log(`Retrieved dishwasher: ${JSON.stringify(dishwasher)}`)
    // }),
    Effect.map((dishwasher) => dishwasher.haId)
    // Effect.tap((haId) => {
    //   console.log(`Dishwasher HA ID: ${haId}`)
    // })
  )

  return haId
}

export async function getDishwasherOperationState() {
  const state = pipe(getDishwasherHaId(), Effect.flatMap(getOperationState))

  const exit = await Effect.runPromiseExit(state)

  console.log(
    Exit.match(exit, {
      onSuccess: (value) =>
        `Dishwasher Operation State: ${JSON.stringify(value)}`,
      onFailure: (error) =>
        `Dishwasher Operation State Error: ${JSON.stringify(error)}`,
    })
  )

  return exit
}

export async function setDishwasherPowerOn() {
  await Effect.runPromise(pipe(getDishwasherHaId(), Effect.flatMap(setPowerOn)))
}

export async function getDishwasherAvailablePrograms() {
  const programs = pipe(
    getDishwasherHaId(),
    Effect.flatMap(getAvailablePrograms)
  )

  const exit = await Effect.runPromiseExit(programs)

  console.log(
    Exit.match(exit, {
      onSuccess: (value) => `Available Programs: ${JSON.stringify(value)}`,
      onFailure: (error) =>
        `Available Programs Error: ${JSON.stringify(error)}`,
    })
  )

  return exit
}

export async function setDishwasherProgram() {
  await Effect.runPromise(
    pipe(getDishwasherHaId(), Effect.flatMap(setSelectedProgram))
  )
}

export async function getDishwasherProgramOptions() {
  const options = pipe(
    getDishwasherHaId(),
    Effect.flatMap(getSelectedProgramOptions)
  )

  const exit = await Effect.runPromiseExit(options)

  console.log(
    Exit.match(exit, {
      onSuccess: (value) =>
        `Dishwasher Program Options: ${JSON.stringify(value)}`,
      onFailure: (error) =>
        `Dishwasher Program Options Error: ${JSON.stringify(error)}`,
    })
  )

  return exit
}

export async function setDishwasherDelayStart() {
  await Effect.runPromise(
    pipe(getDishwasherHaId(), Effect.flatMap(setDelayStart))
  )
}

export async function setDishwasherActiveProgram(delayStartSeconds: number) {
  await Effect.runPromise(
    pipe(
      getDishwasherHaId(),
      Effect.flatMap((haId) => setActiveProgram({ haId, delayStartSeconds }))
    )
  )
}

export async function getDishWasherStatus() {
  const token = pipe(
    getAllAppliances(),
    Effect.tap((appliances) =>
      console.log(`Retrieved appliances: ${JSON.stringify(appliances)}`)
    ),
    Effect.flatMap(getDishWasher),
    Effect.tap((dishwasher) => {
      console.log(`Retrieved dishwasher: ${JSON.stringify(dishwasher)}`)
    }),
    Effect.map((dishwasher) => dishwasher.haId),
    Effect.tap((haId) => {
      console.log(`Dishwasher HA ID: ${haId}`)
    }),
    Effect.flatMap(getDoorStatus),
    Effect.tap((status) => {
      console.log(`Dishwasher door status: ${JSON.stringify(status)}`)
    })
  )

  const exit = await Effect.runPromiseExit(token)

  console.log(
    Exit.match(exit, {
      onSuccess: (value) => `Output: ${JSON.stringify(value)}`,
      onFailure: (error) => `Error: ${JSON.stringify(error)}`,
    })
  )

  return exit
}

export function retrieveClientCredentialsFromStorage(authCode: string): Effect.Effect<
  HomeConnectCredentials,
  null
> {
  const clientId = localStorage.getItem('clientId')
  const clientSecret = localStorage.getItem('clientSecret')

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
          redirect_uri: 'http://localhost:5173/octopus-rates-client/',
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

function storeAccessToken(token: HomeConnectOAuthTokenResponse) {
  console.log(`Storing token: ${JSON.stringify(token)}`)
  localStorage.setItem('accessToken', token.access_token)
  localStorage.setItem('refreshToken', token.refresh_token)
  localStorage.setItem('expiresIn', token.expires_in.toString())

  return token
}

function getAllAppliances(): Effect.Effect<
  HomeConnectAppliance[],
  UnknownException
> {
  return Effect.tryPromise(() =>
    axios
      .get<GetHomeConnectApplianceResponse>(
        'https://simulator.home-connect.com/api/homeappliances',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => response.data.data.homeappliances)
  )
}

function getDishWasher(appliances: HomeConnectAppliance[]) {
  const dishwasher = appliances.find(
    (appliance) => appliance.type === 'Dishwasher'
  )
  return dishwasher ? Effect.succeed(dishwasher) : Effect.fail(null)
}

function getDoorStatus(haId: string) {
  return Effect.tryPromise(() =>
    axios
      .get<GetHomeConnectStatusDoorResponse>(
        `https://simulator.home-connect.com/api/homeappliances/${haId}/status/BSH.Common.Status.DoorState`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => response.data.data)
  )
}
