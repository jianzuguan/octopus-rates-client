'use client'

import { ElecRate } from '@/types/ElecRate'
import { getDisplayTime } from '@/utils/getDisplayTime'
import { priceToColourClass } from '@/utils/priceToColourClass'
import { toFixedPrice } from '@/utils/toFixedPrice'

type Props = {
  item: ElecRate
  now: Date
}

export function ElecRateItem({ item, now }: Props) {
  const nowStr = now.toISOString()
  const isNow = item.valid_from < nowStr && nowStr < item.valid_to

  return (
    <div
      className={[
        'flex flex-row justify-between items-center',
        'px-4 space-x-8',
        'rounded-lg shadow-lg',
        priceToColourClass('bg', item.value_inc_vat),
        // isNow ? 'my-4 ring-8' : 'my-0.5',
        isNow ? 'ring-8' : '',
      ].join(' ')}
    >
      <p>{getDisplayTime(item.valid_from)}</p>
      <p >{toFixedPrice(item.value_inc_vat)}</p>
    </div>
  )
}
