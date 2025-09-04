import { config } from "@/config/env";
import { GetHomeConnectStatusDoorResponse } from "@/types/HomeConnect";
import axios from "axios";
import { Effect } from "effect";

export function getDoorState(haId: string) {
  return Effect.tryPromise(() =>
    axios
      .get<GetHomeConnectStatusDoorResponse>(
        `${config.homeConnect.apiUrl}/homeappliances/${haId}/status/BSH.Common.Status.DoorState`,
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
