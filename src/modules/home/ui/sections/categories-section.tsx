'use client'

import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { FilterCarousel } from '@/components/filter-carousel'
import { trpc } from '@/trpc/client'

interface CategoriesSectionProps {
  categoryId?: string
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<FilterCarousel isLoading data={[]} />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const [categories] = trpc.category.getMany.useSuspenseQuery()

  const data = categories.map(({ id, name }) => ({
    label: name,
    value: id,
  }))

  return <FilterCarousel value={categoryId} data={data} />
}
