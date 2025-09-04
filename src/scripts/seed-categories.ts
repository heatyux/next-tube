import { db } from '@/db'
import { categories } from '@/db/schema'

const categoryNames = [
  'Cars and vehicles',
  'Comedy',
  'Education',
  'Gaming',
  'Entertainment',
  'Film and animation',
  'How-to and style',
  'Music',
  'News and politics',
  'People and blogs',
  'Pets and animals',
  'Science and technology',
  'Sports',
  'Travles and events',
]

async function main() {
  console.log('Seeding categories...')

  try {
    const values = categoryNames.map((category) => ({
      name: category,
      description: `Video on ${category}`,
    }))

    await db.insert(categories).values(values)

    console.log('Categories seeded successfully')
  } catch (error) {
    console.error('Error seeding categories: ', error)
    process.exit(1)
  }
}

main()
