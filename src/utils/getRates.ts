'use server'

import { OctopusAgileResponse } from '@/types/OctopusAgileResponse'
import { Effect, Exit, pipe } from 'effect'
import { UnknownException } from 'effect/Cause'

export async function getRates(): Promise<OctopusAgileResponse> {
  const result = await Effect.runPromiseExit(
    pipe(
      getTokenFromStorage(),
      Effect.flatMap(getAgileRates),
      Effect.flatMap(getJson)
      // Effect.tap((data) => Effect.sync(() => console.log(data))),
    )
  )

  return Exit.getOrElse(result, (e) => {
    console.error(e)
    return { results: [] }
  })
}

function getTokenFromStorage() {
  return Effect.try({
    try: () => {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found in local storage')
      }
      return token
    },
    catch: (e) => new Error(`something went wrong ${e}`),
  })
}

function getAgileRates(token: string) {
  return Effect.tryPromise(() =>
    fetch(
      // Endpoint can be found at https://api.octopus.energy/v1/products/AGILE-24-10-01/
      'https://api.octopus.energy/v1/products/AGILE-24-10-01/electricity-tariffs/E-1R-AGILE-24-10-01-B/standard-unit-rates/',
      {
        headers: {
          Authorization: 'Basic ' + btoa(`${token}:`),
        },
        // next: { revalidate: 60 * 60 * 0.5 },
      }
    )
  )
}

function getJson(
  res: Response
): Effect.Effect<OctopusAgileResponse, UnknownException | string> {
  return res.ok
    ? Effect.tryPromise(() => res.json())
    : Effect.fail('Failed to fetch data')
}
