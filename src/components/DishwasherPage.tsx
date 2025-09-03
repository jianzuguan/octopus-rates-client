import { ElecRate } from '@/types/ElecRate'
import { calculateUsagePrice, Result } from '@/utils/calculateUsagePrice'
import {
  getClientIdAndNavigate,
  getDishwasherAvailablePrograms,
  getDishwasherOperationState,
  getDishwasherProgramOptions,
  getHomeConnectOAuthToken,
  setDishwasherActiveProgram,
  setDishwasherDelayStart,
  setDishwasherPowerOn,
  setDishwasherProgram,
} from '@/utils/home-connet'
import { ChronoUnit, LocalDateTime, ZonedDateTime, ZoneId } from '@js-joda/core'
import { useEffect, useState } from 'react'
import { CalculationIo } from './CalculationIo'
import { DateTimePicker } from './DateTimePicker'

type Props = {
  rates: ElecRate[]
}

export function DishWasherPage({ rates }: Props) {
  const [availableRates, setAvailableRates] = useState(rates)
  const [now, setNow] = useState(new Date())
  const [selectedDateTime, setSelectedDateTime] = useState<LocalDateTime>(
    LocalDateTime.now().plusDays(2)
  )

  const [cheapestPeriod, setsCheapestPeriod] = useState<Result>()
  const [cheapestStartLocalDateTime, setCheapestStartLocalDateTime] =
    useState<LocalDateTime>()

  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check for Home Connect authorization code in URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const authCode = urlParams.get('code')

    if (authCode) {
      getHomeConnectOAuthToken(authCode)

      // Clean up the URL by removing the code parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('code')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const laterRates = rates
      .filter(({ valid_from }) => now.toISOString() < valid_from)
      .filter(({ valid_to }) => valid_to < selectedDateTime.toString())
    setAvailableRates(laterRates)
  }, [now, rates])

  useEffect(() => {
    if (!availableRates.length) {
      return
    }

    const calculationResult = calculateUsagePrice({
      rates: availableRates,
      halfHours: 8,
      usageKwh: 0.75,
    })
    setsCheapestPeriod(calculationResult)
  }, [availableRates])

  useEffect(() => {
    if (!cheapestPeriod) {
      return
    }

    const cheapestStart = ZonedDateTime.parse(cheapestPeriod.from)
      .withZoneSameInstant(ZoneId.systemDefault())
      .toLocalDateTime()

    setCheapestStartLocalDateTime(cheapestStart)
  }, [cheapestPeriod])

  return (
    <div className={['flex flex-col', 'p-6 space-y-6'].join(' ')}>
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
          min={LocalDateTime.now()}
          className="w-full"
        />

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected: {selectedDateTime.toLocalDate().toString()}{' '}
          {selectedDateTime.toLocalTime().toString()}
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

      <div>
        <h3>Will schedule to start at</h3>
        {cheapestStartLocalDateTime?.toString()}
        <h3>
          Will schedule to start in{' '}
          {cheapestStartLocalDateTime !== undefined
            ? LocalDateTime.now()
                .until(cheapestStartLocalDateTime, ChronoUnit.SECONDS)
                .toString()
            : ''}{' '}
          seconds
        </h3>
      </div>

      <button
        onClick={getClientIdAndNavigate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Request Access Token
      </button>

      <button
        onClick={getDishwasherOperationState}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Get Dishwasher Operation State
      </button>

      <button
        onClick={setDishwasherPowerOn}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Turn Dishwasher On
      </button>

      <button
        onClick={getDishwasherAvailablePrograms}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Get Dishwasher Available Programs
      </button>

      <button
        onClick={setDishwasherProgram}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Set Dishwasher Program
      </button>

      <button
        onClick={getDishwasherProgramOptions}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Get Dishwasher Program Options
      </button>

      <button
        onClick={setDishwasherDelayStart}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Set Dishwasher Delay Start
      </button>

      <button
        onClick={() =>
          setDishwasherActiveProgram(
            cheapestStartLocalDateTime !== undefined
              ? LocalDateTime.now().until(
                  cheapestStartLocalDateTime,
                  ChronoUnit.SECONDS
                )
              : 60 * 60 * 12
          )
        }
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Delay start program Eco 50
      </button>
    </div>
  )
}
