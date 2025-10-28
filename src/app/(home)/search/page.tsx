import { SearchView } from '@/modules/search/ui/views/search-view'
import { HydrateClient, trpc } from '@/trpc/server'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    categoryId?: string
  }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query, categoryId } = await searchParams

  void trpc.category.getMany.prefetch()

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  )
}

export default SearchPage
