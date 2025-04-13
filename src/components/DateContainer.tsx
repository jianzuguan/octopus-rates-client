'use client'

type Props = {
  date: string
  children: React.ReactNode
}
export function DateContainer({ date, children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold">{date}</h2>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  )
}
