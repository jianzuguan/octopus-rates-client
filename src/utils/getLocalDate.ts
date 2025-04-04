import { ZonedDateTime, ZoneId } from '@js-joda/core'
import '@js-joda/timezone'

export function getLocalDate(utcDateString: string): string {
  const utcDate = ZonedDateTime.parse(utcDateString) // Parse the UTC datetime
  const localDate = utcDate.withZoneSameInstant(ZoneId.systemDefault()) // Convert to local timezone
  return localDate.toLocalDate().toString() // Extract and return the local date in YYYY-MM-DD format
}
