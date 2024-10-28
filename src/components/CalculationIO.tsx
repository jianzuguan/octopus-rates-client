import { ElecRate } from '@/types/ElecRate'
import { calculateUsagePrice, Result } from '@/utils/calculateUsagePrice'
import { useEffect, useState } from 'react'

type Props = {
  rates: ElecRate[]
  halfHours?: number
  usageKwh?: number
}

export function CalculationIO(props: Props) {
  const { rates } = props
  const [halfHours, setHalfHours] = useState(props.halfHours ?? 4)
  const [usageKwh, setUsageKwh] = useState(props.usageKwh ?? 1)
  const [cheapestPeriod, setsCheapestPeriod] = useState<Result>()

  useEffect(() => {
    if (!rates.length) {
      return
    }

    const calculationResult = calculateUsagePrice({
      rates,
      halfHours,
      usageKwh,
    })
    setsCheapestPeriod(calculationResult)
  }, [rates, halfHours, usageKwh])

  return (
    <div className="m-4">
      <div className="flex flex-row justify-between items-center px-4 space-x-8">
        <label>Half hours: {halfHours}</label>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setHalfHours(dec(halfHours))}
        >
          -
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setHalfHours(inc(halfHours))}
        >
          +
        </button>
      </div>
      <label>
        Usage kWh:
        <input
          className={[
            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg',
            'focus:ring-blue-500 focus:border-blue-500',
            'p-2.5',
            'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
          ].join(' ')}
          type="number"
          value={usageKwh}
          onChange={(e) => setUsageKwh(Number(e.target.value))}
        />
      </label>
      {cheapestPeriod && (
        <div>
          <p>Cheapest period</p>
          <p>From: {cheapestPeriod.from.replace('T', ' ').replace('Z','')}</p>
          <p>To: {cheapestPeriod.to.replace('T', ' ').replace('Z','')}</p>
          <p>Sum: {cheapestPeriod.sum}</p>
          {cheapestPeriod.average && <p>Average: {cheapestPeriod.average}</p>}
          {cheapestPeriod.usageCost && (
            <p>Usage cost: {cheapestPeriod.usageCost}</p>
          )}
        </div>
      )}
    </div>
  )
}

function inc(x: number) {
  return x + 0.5
}

function dec(x: number) {
  return x - 0.5 < 0 ? 0 : x - 0.5
}
