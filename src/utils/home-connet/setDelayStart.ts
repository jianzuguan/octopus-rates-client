import axios from 'axios'
import { Effect } from 'effect'

export function setDelayStart(haId: string) {
  return Effect.tryPromise(() =>
    axios.put(
      `https://simulator.home-connect.com/api/homeappliances/${haId}/programs/selected/options/BSH.Common.Option.StartInRelative`,
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
