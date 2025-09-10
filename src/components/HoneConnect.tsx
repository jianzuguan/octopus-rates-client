import { HomeConnectProgram } from '@/types/HomeConnect'
import {
  getClientIdAndNavigate,
  getDishwasherActiveProgram,
  getDishWasherDoorState,
  getDishwasherOperationState,
  getHomeConnectOAuthToken,
  refreshHomeConnectAccessToken,
  setDishwasherActiveProgram,
  setDishwasherPowerOn,
} from '@/utils/home-connet'
import { ChronoUnit, LocalDateTime } from '@js-joda/core'
import { Exit } from 'effect'
import { useEffect, useState } from 'react'

interface Props {
  cheapestStartLocalDateTime?: LocalDateTime
}

export function HomeConnect({ cheapestStartLocalDateTime }: Props) {
  const [operationState, setOperationState] = useState<string>()
  const [doorState, setDoorState] = useState<string>()
  const [activeProgram, setActiveProgram] = useState<HomeConnectProgram>()

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
    const refreshToken = async () => {
      await refreshHomeConnectAccessToken()
      await handleGetDishwasherStates()
    }
    refreshToken()
  }, [])

  const handleGetDishwasherStates = async () => {
    const doorStateExit = await getDishWasherDoorState()
    Exit.match(doorStateExit, {
      onSuccess: ({ value, displayvalue }) =>
        setDoorState(displayvalue ?? value),
      onFailure: (error) => console.error(error),
    })
    const operationStateExit = await getDishwasherOperationState()
    Exit.match(operationStateExit, {
      onSuccess: ({ value, displayvalue }) =>
        setOperationState(displayvalue ?? value),
      onFailure: (error) => console.error(error),
    })

    const activeProgramExit = await getDishwasherActiveProgram()
    Exit.match(activeProgramExit, {
      onSuccess: (program) => setActiveProgram(program),
      onFailure: (error) => console.error(error),
    })
  }

  const handleScheduleDishwasher = async () => {
    if (!cheapestStartLocalDateTime) {
      return
    }

    await setDishwasherPowerOn()

    await setDishwasherActiveProgram(
      LocalDateTime.now().until(cheapestStartLocalDateTime, ChronoUnit.SECONDS)
    )
  }

  return (
    <div className={['flex flex-col', 'space-y-6'].join(' ')}>
      <div>HomeConnect</div>

      <button
        onClick={getClientIdAndNavigate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Request Access Token
      </button>

      <div>Operation State: {operationState}</div>
      <div>Door State: {doorState}</div>

      <button
        onClick={handleGetDishwasherStates}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Get Dishwasher States
      </button>

      {activeProgram && (
        <div>
          <h3>Active Program:</h3>
          <div>Name: {activeProgram.name ?? activeProgram.key}</div>
          <div>Options:</div>
          {!activeProgram.options || activeProgram.options.length === 0 ? (
            <div>No options available</div>
          ) : (
            <ul>
              {activeProgram.options.map((option) => (
                <li key={option.key}>
                  {option.key}: {option.value} ({option.unit})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={handleScheduleDishwasher}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Delay start program Eco 50
      </button>
    </div>
  )
}
