import { LocalDateTime } from '@js-joda/core'
import { useEffect, useState } from 'react'

type Props = {
  value?: LocalDateTime
  onChange: (date: LocalDateTime) => void
  label?: string
  disabled?: boolean
  min?: LocalDateTime
  max?: LocalDateTime
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  label,
  disabled = false,
  min,
  max,
  className = '',
}: Props) {
  const [localDateTime, setLocalDateTime] = useState<string>('')

  useEffect(() => {
    if (value) {
      setLocalDateTime(value.toString())
    }
  }, [value])

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTimeValue = e.target.value
    setLocalDateTime(dateTimeValue)

    if (dateTimeValue) {
      // Convert the local datetime string to Date object
      const date = LocalDateTime.parse(dateTimeValue)
      onChange(date)
    }
  }

  const formatMinMax = (date?: LocalDateTime): string | undefined => {
    if (!date) return undefined
    return date.toString()
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type="datetime-local"
        value={localDateTime}
        onChange={handleDateTimeChange}
        disabled={disabled}
        min={formatMinMax(min)}
        max={formatMinMax(max)}
        className={[
          'px-3 py-2',
          'border rounded-lg',
          'bg-white dark:bg-gray-800',
          'border-gray-200 dark:border-gray-700',
          'text-gray-900 dark:text-gray-100',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'text-sm',
        ].join(' ')}
      />
    </div>
  )
}
