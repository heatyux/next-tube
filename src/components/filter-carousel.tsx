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

interface FilterCarouselProps {
  value?: string
  data: {
    label: string
    value: string
  }[]
}

export const FilterCarousel = ({ data }: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

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
          <CarouselItem className="basis-auto pl-3">
            <Badge
              variant="secondary"
              className="cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap"
            >
              All
            </Badge>
          </CarouselItem>
          {data.map((item) => (
            <CarouselItem key={item.value} className="basis-auto pl-3">
              <Badge
                variant="secondary"
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
