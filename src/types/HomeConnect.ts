export interface HomeConnectOAuthTokenRequest {
  client_id: string
  redirect_uri: string
  grant_type: 'authorization_code'
  code: string
}

export interface HomeConnectCredentials {
  clientId: string
  clientSecret: string
  authCode: string
}

export interface HomeConnectOAuthTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface HomeConnectAppliance {
  name: string
  brand: string
  vib: string
  connected: boolean
  type: string
  enumber: string
  haId: string
}

export interface GetHomeConnectApplianceResponse {
  data: {
    homeappliances: HomeConnectAppliance[]
  }
}

export interface GetStatusResponse {
  data: {
    key: string
    value: string
    name?: string
    displayvalue?: string
  }
}

export interface HomeConnectProgram {
  key: string
  name?: string
  options?: GetProgramOption[]
}

export interface GetProgramResponse {
  data: HomeConnectProgram
}

export interface GetProgramOption {
  key: string
  value: string
  unit?: string
  name?: string
  displayvalue?: string
}

export interface GetProgramOptionsResponse {
  data: {
    options: GetProgramOption[]
  }
}

export interface HomeConnectStatusDoor {
  key: string
  name?: string
  value: string
  displayvalue?: string
  type?: string
}

export interface GetHomeConnectStatusDoorResponse {
  data: HomeConnectStatusDoor
}
