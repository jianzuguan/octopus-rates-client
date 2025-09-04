import { Effect, Exit, pipe } from 'effect'
import {
  navigateToHomeConnectAuth,
  requestAccessToken,
  retrieveClientCredentialsFromStorage,
  storeAccessToken,
} from './auth'
import { getActiveProgram } from './getActiveProgram'
import { getAvailablePrograms } from './getAvailabePrograms'
import { getDishwasherHaId } from './getDishwasherHaId'
import { getDoorState } from './getDoorStatus'
import { getOperationState } from './getOperationState'
import { getSelectedProgramOptions } from './getSelectedProgramOptions'
import { setActiveProgram } from './setActiveProgram'
import { setDelayStart } from './setDelayStart'
import { setPowerOn } from './setPowerOn'
import { setSelectedProgram } from './setSeletedProgram'

export function getClientIdAndNavigate() {
  const clientId = localStorage.getItem('clientId')

  if (!clientId) {
    console.error('Client ID not found in local storage')
  } else {
    navigateToHomeConnectAuth(clientId)
  }
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

export async function getDishWasherDoorState() {
  const token = pipe(
    getDishwasherHaId(),
    Effect.flatMap(getDoorState),
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

export function getDishwasherActiveProgram() {
  const program = pipe(getDishwasherHaId(), Effect.flatMap(getActiveProgram))

  const exit = Effect.runPromiseExit(program)
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
