import { config } from '@/config/env'
import {
  GetHomeConnectApplianceResponse,
  HomeConnectAppliance,
} from '@/types/HomeConnect'
import axios from 'axios'
import { Effect } from 'effect'
import { UnknownException } from 'effect/Cause'

export function getAllAppliances(): Effect.Effect<
  HomeConnectAppliance[],
  UnknownException
> {
  return Effect.tryPromise(() =>
    axios
      .get<GetHomeConnectApplianceResponse>(
        `${config.homeConnect.apiUrl}/homeappliances`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => response.data.data.homeappliances)
  )
}
