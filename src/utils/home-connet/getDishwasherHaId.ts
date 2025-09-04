import { Effect, pipe } from 'effect'
import { getAllAppliances } from './getAllAppliances'
import { getDishWasher } from './getDishWasher'

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
