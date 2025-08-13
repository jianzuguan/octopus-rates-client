import { ElecRate } from '@/types/ElecRate'
import { getClientIdAndNavigate } from '@/utils/homeConnect'
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
