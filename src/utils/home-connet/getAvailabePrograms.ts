import { GetStatusResponse } from "@/types/HomeConnect";
import axios from "axios";
import { Effect } from "effect";

export function getAvailablePrograms(haId: string) {
  return Effect.tryPromise(() =>
    axios
      .get<GetStatusResponse>(
        `https://simulator.home-connect.com/api/homeappliances/${haId}/programs/available`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => response.data.data)
  )
}
