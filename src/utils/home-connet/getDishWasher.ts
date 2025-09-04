import { HomeConnectAppliance } from '@/types/HomeConnect'
import { Effect } from 'effect'

export function getDishWasher(appliances: HomeConnectAppliance[]) {
  const dishwasher = appliances.find(
    (appliance) => appliance.type === 'Dishwasher'
  )
  return dishwasher ? Effect.succeed(dishwasher) : Effect.fail(null)
}
