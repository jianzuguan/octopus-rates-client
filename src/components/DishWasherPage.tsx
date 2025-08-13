import { ElecRate } from '@/types/ElecRate'
import { HomeConnectOAuthTokenRequest } from '@/types/HomeConnect'
import { getClientIdAndNavigate, getHomeConnectOAuthToken } from '@/utils/homeConnect'
import { useEffect, useState } from 'react'
import { CalculationIo } from './CalculationIo'
import { DateTimePicker } from './DateTimePicker'

type Props = {
  rates: ElecRate[]
}

export function DishWasherPage({ rates }: Props) {
  const [now, setNow] = useState(new Date())
  const [availableRates, setAvailableRates] = useState(rates)
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date())
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string>('')

  const handleHomeConnectAuth = async () => {
    setIsConnecting(true)
    setConnectionStatus('')

    try {
      // Example OAuth request - you'll need to replace with actual values
      const oauthRequest: HomeConnectOAuthTokenRequest = {
        client_id: 'your_client_id',
        redirect_uri: 'your_redirect_uri',
        grant_type: 'authorization_code',
        code: 'authorization_code_from_oauth_flow',
      }

      const exit = await getHomeConnectOAuthToken(oauthRequest)

      if (exit._tag === 'Success') {
        setConnectionStatus('Successfully connected to Home Connect!')
        console.log('OAuth Token:', exit.value)
      } else {
        setConnectionStatus('Failed to connect to Home Connect')
        console.error('OAuth Error:', exit.cause)
      }
    } catch (error) {
      setConnectionStatus('Error connecting to Home Connect')
      console.error('Connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const laterRates = rates.filter(
      (rate) => now.toISOString() < rate.valid_from
    )
    setAvailableRates(laterRates)
  }, [now, rates])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Dishwasher Schedule
      </h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Schedule Settings
        </h2>

        <DateTimePicker
          label="I need the dishes by"
          value={selectedDateTime}
          onChange={setSelectedDateTime}
          min={new Date()}
          className="w-full"
        />

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected: {selectedDateTime.toLocaleString()}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Rate Calculation
        </h2>

        <CalculationIo
          title="Dishwasher Usage"
          rates={availableRates}
          halfHours={8}
          usageKwh={0.75}
        />
      </div>

      <button
        onClick={getClientIdAndNavigate}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect to Home Connect'}
      </button>
    </div>
  )
}

function logToken() {
  console.log('OAuth Token:')
}
