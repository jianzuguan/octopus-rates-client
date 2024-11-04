import { CalculationPage } from '@/components/CalculationPage'
import { RatesPage } from '@/components/RatesPage'
import { TokenPage } from '@/components/TokenPage'
import { ElecRate } from '@/types/ElecRate'
import { getRates } from '@/utils/getRates'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [rates, setRates] = useState<ElecRate[]>([])

  useEffect(() => {
    const updateRates = async () => {
      const updatedRates = await getRates()
      setRates(updatedRates.results)
    }

    updateRates()
  }, [])

  return (
    <main
      className={[
        'flex min-h-screen flex-col items-center justify-between',
        'lg:flex-row lg:items-start',
        'p-4'
      ].join(' ')}
    >
      <CalculationPage rates={rates} />
      <RatesPage rates={rates} />
      <TokenPage />
    </main>
  )
}

export default App
