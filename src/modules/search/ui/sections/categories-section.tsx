'use client'

import { Suspense } from 'react'

import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'

import { FilterCarousel } from '@/components/filter-carousel'
import { trpc } from '@/trpc/client'

interface CategoriesSectionProps {
  categoryId?: string
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<CategoriseSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const CategoriseSkeleton = () => (
  <FilterCarousel isLoading data={[]} onSelect={() => {}} />
)

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter()

  const [categories] = trpc.category.getMany.useSuspenseQuery()

  const data = categories.map(({ id, name }) => ({
    label: name,
    value: id,
  }))

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href)

    if (value) {
      url.searchParams.set('categoryId', value)
    } else {
      url.searchParams.delete('categoryId')
    }

    router.push(url.toString())
  }

  return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />
}
