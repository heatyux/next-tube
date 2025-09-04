import { HydrateClient, trpc } from '@/trpc/server'

export default function HomePage() {
  void trpc.hello.prefetch({ text: 'ixe' })

  return <HydrateClient></HydrateClient>
}
