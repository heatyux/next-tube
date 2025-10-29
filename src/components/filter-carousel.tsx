'use client'

import { useEffect, useState } from 'react'

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'

interface FilterCarouselProps {
  value?: string | null
  isLoading?: boolean
  onSelect: (value: string | null) => void
  data: {
    label: string
    value: string
  }[]
}

export const FilterCarousel = ({
  value,
  isLoading,
  onSelect,
  data,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => setIsMounted(true), [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative w-full">
      {/* left fade */}
      <div
        className={cn(
          'pointer-events-none absolute top-0 bottom-0 left-12 z-10 w-12 bg-gradient-to-r from-white to-transparent',
          current === 1 && 'hidden',
        )}
      />

      <Carousel
        opts={{ align: 'start', dragFree: true }}
        setApi={setApi}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index} className="basis-auto pl-3">
                <Skeleton className="h-full w-[100px] rounded-lg px-3 py-1">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}
          {!isLoading && (
            <CarouselItem
              className="basis-auto pl-3"
              onClick={() => onSelect(null)}
            >
              <Badge
                variant={!value ? 'default' : 'secondary'}
                className="cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap"
              >
                All
              </Badge>
            </CarouselItem>
          )}
          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                key={item.value}
                className="basis-auto pl-3"
                onClick={() => onSelect(item.value)}
              >
                <Badge
                  variant={value === item.value ? 'default' : 'secondary'}
                  className="cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>

      {/* right fade */}
      <div
        className={cn(
          'pointer-events-none absolute top-0 right-12 bottom-0 z-10 w-12 bg-gradient-to-r from-transparent to-white',
          count === current && 'hidden',
        )}
      />
    </div>
  )
}
