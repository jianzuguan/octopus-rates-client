/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOME_CONNECT_API_URL: string
  readonly VITE_HOME_CONNECT_OAUTH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
