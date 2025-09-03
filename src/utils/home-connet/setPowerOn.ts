import axios from 'axios'
import { Effect } from 'effect'

export function setPowerOn(haId: string) {
  return Effect.tryPromise(() =>
    axios.put(
      `https://simulator.home-connect.com/api/homeappliances/${haId}/settings/BSH.Common.Setting.PowerState`,
      {
        data: {
          key: 'BSH.Common.Setting.PowerState',
          value: 'BSH.Common.EnumType.PowerState.On',
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
