import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Dummy data for now (later will come from database)
const dummySalads = [
  {
    id: '1',
    name: 'Salad Caesar Klasik',
    slug: 'caesar-classic',
    description: 'Selada romaine segar, crouton, keju parmesan, dan saus Caesar creamy.',
    price: 55000,
    imageUrl: '/images/salads/caesar.jpg',
    ingredients: ['Selada romaine', 'crouton', 'keju parmesan', 'saus Caesar'],
    calories: 320,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Salad Yunani',
    slug: 'greek-salad',
    description: 'Tomat, timun, paprika, bawang merah, zaitun, dan keju feta dengan saus vinaigrette.',
    price: 50000,
    imageUrl: '/images/salads/greek.jpg',
    ingredients: ['Tomat', 'timun', 'paprika', 'keju feta', 'zaitun', 'saus vinaigrette'],
    calories: 280,
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Salad Ayam Panggang',
    slug: 'grilled-chicken-salad',
    description: 'Dada ayam panggang, selada, tomat ceri, alpukat, dan saus honey mustard.',
    price: 65000,
    imageUrl: '/images/salads/grilled-chicken.jpg',
    ingredients: ['Dada ayam panggang', 'selada', 'tomat ceri', 'alpukat', 'saus honey mustard'],
    calories: 420,
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Salad Quinoa',
    slug: 'quinoa-salad',
    description: 'Quinoa, buncis hitam, jagung, alpukat, paprika, dengan saus lime cilantro.',
    price: 60000,
    imageUrl: '/images/salads/quinoa.jpg',
    ingredients: ['Quinoa', 'buncis hitam', 'jagung', 'alpukat', 'paprika', 'saus lime cilantro'],
    calories: 380,
    isVegan: true,
    isGlutenFree: true,
    isAvailable: true
  },
  {
    id: '5',
    name: 'Salad Buah Tropis',
    slug: 'tropical-fruit-salad',
    description: 'Campuran buah-buahan segar seperti mangga, nanas, dan kiwi dengan saus yoghurt.',
    price: 45000,
    imageUrl: '/images/salads/tropical-fruit.jpg',
    ingredients: ['Mangga', 'nanas', 'kiwi', 'saus yoghurt'],
    calories: 220,
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true
  }
]

export async function GET() {
  try {
    // For now, return dummy data
    // Later you can fetch from database:
    // const salads = await prisma.salad.findMany({
    //   include: { category: true }
    // })
    
    return NextResponse.json({
      success: true,
      data: dummySalads
    })
  } catch (error) {
    console.error('Error fetching salads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}