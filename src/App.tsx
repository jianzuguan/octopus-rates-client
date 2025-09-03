import { CalculationPage } from '@/components/CalculationPage'
import { RatesPage } from '@/components/RatesPage'
import { TokenPage } from '@/components/TokenPage'
import { ElecRate } from '@/types/ElecRate'
import { getRates } from '@/utils/getRates'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSwipeable } from 'react-swipeable'
import './App.css'
import { DishWasherPage } from './components/DishwasherPage'

function App() {
  const [activeTab, setActiveTab] = useState<
    'calculation' | 'rates' | 'dishwasher' | 'token'
  >('rates')

  const [rates, setRates] = useState<ElecRate[]>([])

  useEffect(() => {
    // Check for Home Connect authorization code in URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const authCode = urlParams.get('code')

    if (authCode) {
      // Store the authorization code in localStorage
      localStorage.setItem('homeConnectAuthCode', authCode)

      // Clean up the URL by removing the code parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('code')
      window.history.replaceState({}, '', url.toString())
    }

    const updateRates = async () => {
      const updatedRates = await getRates()
      setRates(updatedRates.results)
    }

    updateRates()
  }, [])

  const handleSwipe = (direction: 'left' | 'right') => {
    const tabs = ['rates', 'calculation', 'dishwasher', 'token'] as const
    const currentIndex = tabs.indexOf(activeTab)
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
  })

  return (
    <main>
      {/* Render Pages */}
      <div className="w-full">
        {/* Show only the active tab on mobile */}
        <div
          {...swipeHandlers}
          className={[
            'lg:hidden pb-16',
            'flex flex-col items-center justify-between',
          ].join(' ')}
        >
          {activeTab === 'calculation' && <CalculationPage rates={rates} />}
          {activeTab === 'rates' && <RatesPage rates={rates} />}
          {activeTab === 'dishwasher' && <DishWasherPage rates={rates} />}
          {activeTab === 'token' && <TokenPage />}
        </div>

        {/* Show all pages on large screens */}
        <div
          className={['hidden', 'lg:flex flex-row justify-between', 'p-4'].join(
            ' '
          )}
        >
          <CalculationPage rates={rates} />
          <RatesPage rates={rates} />
          <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <DishWasherPage rates={rates} />
          </ErrorBoundary>

          <TokenPage />
        </div>
      </div>

      {/* Tab Navigation for Mobile */}
      <div
        className={[
          'lg:hidden',
          'fixed bottom-0 left-0 z-50 w-full h-16',
          'flex justify-around border-b',
          'bg-white dark:bg-black',
        ].join(' ')}
      >
        {' '}
        <button
          className={`p-2 ${activeTab === 'rates' ? 'font-bold border-t-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('rates')}
        >
          Rates
        </button>
        <button
          className={`p-2 ${activeTab === 'calculation' ? 'font-bold border-t-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('calculation')}
        >
          Calculation
        </button>
        <button
          className={`p-2 ${activeTab === 'dishwasher' ? 'font-bold border-t-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('dishwasher')}
        >
          Dishwasher
        </button>
        <button
          className={`p-2 ${activeTab === 'token' ? 'font-bold border-t-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('token')}
        >
          Token
        </button>
      </div>
    </main>
  )
}

export default App
