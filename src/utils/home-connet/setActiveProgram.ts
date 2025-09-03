import { config } from '@/config/env'
import axios from 'axios'
import { Effect } from 'effect'

interface SetActiveProgramParams {
  haUrl?: string
  haId: string
  delayStartSeconds?: number
}

export function setActiveProgram({
  haUrl = config.homeConnect.apiUrl,
  haId,
  delayStartSeconds = 60,
}: SetActiveProgramParams) {
  return Effect.tryPromise(() =>
    axios.put(
      `${haUrl}/homeappliances/${haId}/programs/active`,
      {
        data: {
          key: 'Dishcare.Dishwasher.Program.Eco50',
          name: 'Eco 50',
          options: [
            {
              key: 'BSH.Common.Option.StartInRelative',
              name: 'Start in relative',
              value: delayStartSeconds,
              unit: 'seconds',
            },
          ],
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
