import { ElecRate } from '@/types/ElecRate'

type Args = {
  rates: ElecRate[]
  halfHours: number
  usageKwh: number
}

export type Result = {
  from: string
  to: string
  sum: number
  average?: number
  usageCost?: number
}

export function calculateUsagePrice({
  rates,
  halfHours,
  usageKwh,
}: Args): Result {
  const groups = groupWise(halfHours, rates)

  const groupSums = groups.reduce(calculateSum, [])

  const cheapestPeriod = groupSums.sort((a, b) => a.sum - b.sum)[0]

  return {
    ...cheapestPeriod,
    average: cheapestPeriod.sum / halfHours,
    usageCost: (cheapestPeriod.sum / halfHours) * usageKwh,
  }
}

function groupWise(groupSize: number, arr: ElecRate[]): ElecRate[][] {
  if (arr.length < groupSize) {
    return []
  }
  if (arr.length === groupSize) {
    return [arr]
  }
  const firstGroup = arr.slice(0, groupSize)
  const rest = arr.slice(1)

  return [firstGroup, ...groupWise(groupSize, rest)]
}

function calculateSum(acc: Result[], rates: ElecRate[]): Result[] {
  const total = rates
    .sort((a, b) => (a.valid_from < b.valid_from ? -1 : 1))
    .reduce((acc, rate) => acc + rate.value_inc_vat, 0)
  const from = rates[0].valid_from
  const to = rates[rates.length - 1].valid_to

  const result: Result = { from, to, sum: total }
  return [...acc, result]
}
