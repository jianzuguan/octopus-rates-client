import { useEffect, useState } from 'react'

type Props = {
  value?: Date
  onChange: (date: Date) => void
  label?: string
  disabled?: boolean
  min?: Date
  max?: Date
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
      // Convert Date to local datetime string for input
      const year = value.getFullYear()
      const month = (value.getMonth() + 1).toString().padStart(2, '0')
      const day = value.getDate().toString().padStart(2, '0')
      const hours = value.getHours().toString().padStart(2, '0')
      const minutes = value.getMinutes().toString().padStart(2, '0')
      setLocalDateTime(`${year}-${month}-${day}T${hours}:${minutes}`)
    }
  }, [value])

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTimeValue = e.target.value
    setLocalDateTime(dateTimeValue)

    if (dateTimeValue) {
      // Convert the local datetime string to Date object
      const date = new Date(dateTimeValue)
      onChange(date)
    }
  }

  const formatMinMax = (date?: Date): string | undefined => {
    if (!date) return undefined
    
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
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
