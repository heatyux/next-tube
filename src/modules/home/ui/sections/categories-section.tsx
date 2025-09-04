'use client'

import { trpc } from '@/trpc/client'

type CategoriesSectionProps = {
  categoryId?: string
}

export const CategoriesSection = ({}: CategoriesSectionProps) => {
  const [categories] = trpc.category.getMany.useSuspenseQuery()

  return <div>{JSON.stringify(categories)}</div>
}
