import { config } from '@/config/env';
import { GetStatusResponse } from "@/types/HomeConnect";
import axios from "axios";
import { Effect } from "effect";

export function getAvailablePrograms(haId: string) {
  return Effect.tryPromise(() =>
    axios
      .get<GetStatusResponse>(
        `${config.homeConnect.apiUrl}/homeappliances/${haId}/programs/available`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => response.data.data)
  )
}
