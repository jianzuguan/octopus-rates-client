import { config } from '@/config/env'
import axios from 'axios'
import { Effect } from 'effect'

export function setSelectedProgram(haId: string) {
  return Effect.tryPromise(() =>
    axios.put(
      `${config.homeConnect.apiUrl}/homeappliances/${haId}/programs/selected`,
      {
        data: {
          key: 'Dishcare.Dishwasher.Program.Auto3',
          name: 'Eco 50',
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
