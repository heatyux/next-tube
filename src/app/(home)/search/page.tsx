interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    categoryId?: string
  }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query, categoryId } = await searchParams

  return <>search page</>
}

export default SearchPage
