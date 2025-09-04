import { config } from '@/config/env'
import { GetProgramOptionsResponse } from '@/types/HomeConnect'
import axios from 'axios'
import { Effect } from 'effect'

export function getSelectedProgramOptions(haId: string) {
  return Effect.tryPromise(() =>
    axios.get<GetProgramOptionsResponse>(
      `${config.homeConnect.apiUrl}/homeappliances/${haId}/programs/selected/options`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    ).then((response) => response.data.data.options)
  )
}
