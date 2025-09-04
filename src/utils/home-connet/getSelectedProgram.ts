import { config } from '@/config/env'
import {
  GetProgramResponse
} from '@/types/HomeConnect'
import axios from 'axios'
import { Effect } from 'effect'

export function getSelectedProgram(haId: string) {
  return Effect.tryPromise(() =>
    axios
      .get<GetProgramResponse>(
        `${config.homeConnect.apiUrl}/homeappliances/${haId}/programs/selected`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Accept-Language': 'en-GB',
          },
        }
      )
      .then((response) => response.data.data)
  )
}
