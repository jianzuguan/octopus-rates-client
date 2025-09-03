import { config } from '@/config/env'
import axios from 'axios'
import { Effect } from 'effect'

export function setDelayStart(haId: string) {
  return Effect.tryPromise(() =>
    axios.put(
      `${config.homeConnect.apiUrl}/homeappliances/${haId}/programs/selected/options/BSH.Common.Option.StartInRelative`,
      {
        data: {
          key: 'BSH.Common.Option.StartInRelative',
          value: 60,
          unit: 'seconds',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    )
  )
}
