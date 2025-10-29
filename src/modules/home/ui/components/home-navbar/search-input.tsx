'use client'

import { useState } from 'react'

import { SearchIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { APP_URL } from '@/constants'

export const SearchInput = () => {
  const router = useRouter()

  const [value, setValue] = useState('')

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const url = new URL('/search', APP_URL)
    const newQuery = value.trim()

    url.searchParams.set('query', encodeURIComponent(newQuery))

    if (newQuery === '') {
      url.searchParams.delete('query')
    }

    setValue(newQuery)

    router.push(url.toString())
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full rounded-l-full border py-2 pr-12 pl-4 text-gray-500 focus:border-blue-500 focus:outline-none"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-[50%] right-2 -translate-1/2 rounded-full"
            onClick={() => setValue('')}
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>
      <button
        disabled={!value.trim()}
        type="submit"
        className="rounded-r-full border border-l-0 bg-gray-100 px-5 py-2.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  )
}
