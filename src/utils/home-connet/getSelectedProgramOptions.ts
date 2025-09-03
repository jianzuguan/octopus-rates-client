import { config } from '@/config/env'
import { GetProgramOptions } from '@/types/HomeConnect'
import axios from 'axios'
import { Effect } from 'effect'

export function getSelectedProgramOptions(haId: string) {
  return Effect.tryPromise(() =>
    axios.get<GetProgramOptions>(
      `${config.homeConnect.apiUrl}/homeappliances/${haId}/programs/selected/options`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    ).then((response) => response.data.data.options)
  )
}
