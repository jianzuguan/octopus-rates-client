import { useEffect, useState } from 'react'

export function TokenPage() {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div
      className={[
        'h-[calc(100vh-4rem)]',
        'flex flex-col justify-center items-center',
      ].join(' ')}
    >
      <p>
        Get your API token from{' '}
        <a
          href="https://octopus.energy/dashboard/new/accounts/personal-details/api-access"
          target="_blank"
          rel="noreferrer"
        >
          Octopus Energy API Access Page
        </a>
      </p>

      <label>
        Octopus Energy API Token:
        <input
          className={[
            'bg-gray-50 border border-gray-300 rounded-lg',
            'text-gray-900 text-sm',
            'focus:ring-blue-500 focus:border-blue-500',
            'p-2.5',
            'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white',
            'dark:focus:ring-blue-500 dark:focus:border-blue-500',
          ].join(' ')}
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </label>
    </div>
  )
}
