import { GetProgramOptions } from '@/types/HomeConnect'
import axios from 'axios'
import { Effect } from 'effect'

export function getSelectedProgramOptions(haId: string) {
  return Effect.tryPromise(() =>
    axios.get<GetProgramOptions>(
      `https://simulator.home-connect.com/api/homeappliances/${haId}/programs/selected/options`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    ).then((response) => response.data.data.options)
  )
}
