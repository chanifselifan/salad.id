import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const saladCategory = await prisma.category.upsert({
    where: { slug: 'salads' },
    update: {},
    create: {
      name: 'Salads',
      slug: 'salads',
      description: 'Fresh and healthy salads'
    }
  })

  const fruitCategory = await prisma.category.upsert({
    where: { slug: 'fruit-salads' },
    update: {},
    create: {
      name: 'Fruit Salads',
      slug: 'fruit-salads',
      description: 'Sweet and refreshing fruit salads'
    }
  })

  // Create salads
  const salads = [
    {
      name: 'Salad Caesar Klasik',
      slug: 'caesar-classic',
      description: 'Selada romaine segar, crouton, keju parmesan, dan saus Caesar creamy.',
      price: 55000,
      imageUrl: '/images/salads/caesar.jpg',
      ingredients: ['Selada romaine', 'Crouton', 'Keju parmesan', 'Saus Caesar'],
      calories: 320,
      isVegan: false,
      isGlutenFree: false,
      categoryId: saladCategory.id
    },
    {
      name: 'Salad Yunani',
      slug: 'greek-salad',
      description: 'Tomat, timun, paprika, bawang merah, zaitun, dan keju feta dengan saus vinaigrette.',
      price: 50000,
      imageUrl: '/images/salads/greek.jpg',
      ingredients: ['Tomat', 'Timun', 'Paprika', 'Keju feta', 'Zaitun', 'Saus vinaigrette'],
      calories: 280,
      isVegan: false,
      isGlutenFree: true,
      categoryId: saladCategory.id
    },
    {
      name: 'Salad Ayam Panggang',
      slug: 'grilled-chicken-salad',
      description: 'Dada ayam panggang, selada, tomat ceri, alpukat, dan saus honey mustard.',
      price: 65000,
      imageUrl: '/images/salads/grilled-chicken.jpg',
      ingredients: ['Dada ayam panggang', 'Selada', 'Tomat ceri', 'Alpukat', 'Saus honey mustard'],
      calories: 420,
      isVegan: false,
      isGlutenFree: true,
      categoryId: saladCategory.id
    },
    {
      name: 'Salad Quinoa',
      slug: 'quinoa-salad',
      description: 'Quinoa, buncis hitam, jagung, alpukat, paprika, dengan saus lime cilantro.',
      price: 60000,
      imageUrl: '/images/salads/quinoa.jpg',
      ingredients: ['Quinoa', 'Buncis hitam', 'Jagung', 'Alpukat', 'Paprika', 'Saus lime cilantro'],
      calories: 380,
      isVegan: true,
      isGlutenFree: true,
      categoryId: saladCategory.id
    },
    {
      name: 'Salad Buah Tropis',
      slug: 'tropical-fruit-salad',
      description: 'Campuran buah-buahan segar seperti mangga, nanas, dan kiwi dengan saus yoghurt.',
      price: 45000,
      imageUrl: '/images/salads/tropical-fruit.jpg',
      ingredients: ['Mangga', 'Nanas', 'Kiwi', 'Saus yoghurt'],
      calories: 220,
      isVegan: false,
      isGlutenFree: true,
      categoryId: fruitCategory.id
    }
  ]

  for (const salad of salads) {
    await prisma.salad.upsert({
      where: { slug: salad.slug },
      update: {},
      create: salad
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
