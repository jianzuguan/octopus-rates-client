export function getLocalTime(utcDateString: string): string {
  const d = new Date(utcDateString)
  const localHours = d.getHours().toString().padStart(2, '0')
  const localMinutes = d.getMinutes().toString().padStart(2, '0')
  return `${localHours}:${localMinutes}`
}
