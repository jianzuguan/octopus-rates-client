'use client'

import { ElecRate } from '@/types/ElecRate'
import { useEffect, useState } from 'react'
import { DateContainer } from './DateContainer'
import { ElecRateItem } from './ElecRateItem'

type Props = {
  rates: ElecRate[]
}

export function RatesPage({ rates }: Props) {
  const [now, setNow] = useState(new Date())
  const [dateArr, setDateArr] = useState<string[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const dateSet = new Set(rates.map((rate) => rate.valid_from.split('T')[0]))
    const dateArr = Array.from(dateSet)
      .sort((a, b) => (a < b ? -1 : 1))
      .filter((date) => date >= now.toISOString().split('T')[0])
    setDateArr(dateArr)
  }, [rates, now])

  return (
    <div className={['flex', 'flex-col lg:flex-row', 'gap-16'].join(' ')}>
      {dateArr.map((date) => (
        <DateContainer key={date} date={date}>
          {rates
            .filter((rate) => rate.valid_from.split('T')[0] === date)
            .sort((a, b) => (a.valid_from < b.valid_from ? -1 : 1))
            .map((rate) => (
              <ElecRateItem key={rate.valid_from} item={rate} now={now} />
            ))}
        </DateContainer>
      ))}
    </div>
  )
}
