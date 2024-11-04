import { ElecRate } from '@/types/ElecRate'
import { useEffect, useState } from 'react'
import { CalculationIo } from './CalculationIo'

type Props = {
  rates: ElecRate[]
}

export function CalculationPage({ rates }: Props) {
  const [now, setNow] = useState(new Date())
  const [availableRates, setAvailableRates] = useState(rates)

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(()=> {
    const laterRates = rates.filter(rate => now.toISOString() < rate.valid_from)
    setAvailableRates(laterRates)
  }, [now, rates])

  return (
    <div>
      <CalculationIo rates={availableRates} halfHours={8} usageKwh={0.75} />
      <CalculationIo rates={availableRates} halfHours={5} usageKwh={0.8}/>
    </div>
  )
}
