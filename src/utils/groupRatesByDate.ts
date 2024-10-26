import { ElecRate } from '@/types/ElecRate'

export function groupRatesByDate(rates: ElecRate[]) {
  const initialState: Record<string, ElecRate[]> = {}
  return rates.reduce((acc, rate) => {
    const date = rate.valid_from.split('T')[0]
    return {
      ...acc,
      [date]: !acc[date] ? [rate] : [...acc[date], rate],
    }
  }, initialState)
}
