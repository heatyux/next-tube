import { DEFAULT_LIMIT } from '@/constants'
import { SearchView } from '@/modules/search/ui/views/search-view'
import { HydrateClient, trpc } from '@/trpc/server'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    categoryId?: string
  }>
}

export const dynamic = 'force-dynamic'

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query, categoryId } = await searchParams

  void trpc.category.getMany.prefetch()
  void trpc.search.getMany.prefetchInfinite({
    query,
    categoryId,
    limit: DEFAULT_LIMIT,
  })

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  )
}

export default SearchPage
