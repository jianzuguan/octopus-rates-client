'use client'

import { ElecRate } from '@/types/ElecRate'
import { getRates } from '@/utils/getRates'
import { useEffect, useState } from 'react'
import { DateContainer } from './DateContainer'
import { ElecRateItem } from './ElecRateItem'

export function RatesPage() {
  const [now, setNow] = useState(new Date())
  const [rates, setRates] = useState<ElecRate[]>([])
  const [dateArr, setDateArr] = useState<string[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() =>{
    const updateRates = async () => {
      const updatedRates = await getRates()
      setRates(updatedRates.results)
    }

    updateRates()
  },[])

  useEffect(() =>{
    const dateSet = new Set(rates.map((rate) => rate.valid_from.split('T')[0]))
    const dateArr = Array.from(dateSet).sort((a, b) => (a < b ? -1 : 1))
    setDateArr(dateArr)
  }, [rates])

  return (
    <>
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
    </>
  )
}
