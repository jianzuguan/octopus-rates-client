/**
 * Environment configuration for Home Connect API
 * 
 * In development: Uses simulator URLs
 * In production: Uses real Home Connect API URLs
 */

export const config = {
  homeConnect: {
    apiUrl: import.meta.env.VITE_HOME_CONNECT_API_URL || 'https://simulator.home-connect.com/api',
    oauthUrl: import.meta.env.VITE_HOME_CONNECT_OAUTH_URL || 'https://simulator.home-connect.com/security/oauth',
  },
  redirectUri: import.meta.env.DEV 
    ? 'http://localhost:5173/octopus-rates-client/'
    : 'https://jianzuguan.github.io/octopus-rates-client/'
} as const

export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
