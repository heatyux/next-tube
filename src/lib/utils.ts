import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(duration: number) {
  const seconds = Math.floor((duration % 60_000) / 1000)
  const minutes = Math.floor(duration / 60_000)
  const hours = Math.floor(duration / 3_600_000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
