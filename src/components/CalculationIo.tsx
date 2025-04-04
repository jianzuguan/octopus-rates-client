import { ElecRate } from '@/types/ElecRate'
import { calculateUsagePrice, Result } from '@/utils/calculateUsagePrice'
import { getLocalDate } from '@/utils/getLocalDate'
import { getLocalTime } from '@/utils/getLocalTime'
import { useEffect, useState } from 'react'

type Props = {
  title?: string
  rates: ElecRate[]
  halfHours?: number
  usageKwh?: number
}

export function CalculationIo(props: Props) {
  const { title, rates } = props
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
    <div
      className={[
        'm-4 p-4',
        'border rounded-lg',
        'bg-white dark:bg-gray-800',
        'border-gray-200 dark:border-gray-700 ',
        'shadow',
        'grid grid-cols-5',
        'items-center',
      ].join(' ')}
    >
      {title && (
        <h2 className={['text-2xl font-bold', 'col-span-5'].join(' ')}>
          {title}
        </h2>
      )}  
      <label className="col-span-2">Half hours:</label> <p className='place-self-center'>{halfHours}</p>
      <button
        className={[
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          'col-span-1',
        ].join(' ')}
        onClick={() => setHalfHours(dec(halfHours))}
      >
        -
      </button>
      <button
        className={[
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          'col-span-1',
        ].join(' ')}
        onClick={() => setHalfHours(inc(halfHours))}
      >
        +
      </button>
      <label className="col-span-2">Usage kWh:</label>
      <input
        className={[
          'col-span-3',
          'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg',
          'focus:ring-blue-500 focus:border-blue-500',
          'p-2.5',
          'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white',
          'dark:focus:ring-blue-500 dark:focus:border-blue-500',
        ].join(' ')}
        type="number"
        value={usageKwh}
        onChange={(e) => setUsageKwh(Number(e.target.value))}
      />
      {cheapestPeriod && (
        <>
          <hr className="col-span-5 my-2" />

          <p className={['font-bold', 'col-start-1', 'col-span-2'].join(' ')}>
            From:
          </p>
          <p className={['font-bold', 'col-span-2'].join(' ')}>
            {getLocalDate(cheapestPeriod.from)}
          </p>
          <p className={['font-bold', 'col-span-1'].join(' ')}>
            {getLocalTime(cheapestPeriod.from)}
          </p>

          <p className={['col-start-1', 'col-span-2'].join(' ')}>To:</p>
          <p className={['col-span-2'].join(' ')}>
            {getLocalDate(cheapestPeriod.to)}
          </p>
          <p className={['col-span-1'].join(' ')}>
            {getLocalTime(cheapestPeriod.to)}
          </p>

          <p className={['col-start-1', 'col-span-2'].join(' ')}>Sum:</p>
          <p className={['col-span-3'].join(' ')}>{cheapestPeriod.sum}</p>

          {cheapestPeriod.average && (
            <>
              <p className={['col-start-1', 'col-span-2'].join(' ')}>
                Average:
              </p>
              <p className={['col-span-3'].join(' ')}>
                {cheapestPeriod.average}
              </p>
            </>
          )}

          {usageKwh !== 0 && (
            <>
              <p className={['col-start-1', 'col-span-2'].join(' ')}>
                Usage cost:
              </p>
              <p className={['col-span-3'].join(' ')}>
                {cheapestPeriod.usageCost}
              </p>
            </>
          )}
        </>
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
