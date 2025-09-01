// scripts/check-db-ids.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabaseIds() {
  try {
    console.log('🔍 Checking actual database salad IDs...')
    
    const salads = await prisma.salad.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        price: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log('\n📋 ACTUAL Salads in Database:')
    console.log('================================')
    
    salads.forEach((salad, index) => {
      console.log(`${index + 1}. ID: "${salad.id}" | Name: "${salad.name}" | Price: ${salad.price}`)
    })
    
    console.log('\n🔧 COPY THESE REAL IDs for your frontend:')
    console.log('==========================================')
    salads.forEach((salad, index) => {
      console.log(`Position ${index + 1}: "${salad.id}" // ${salad.name}`)
    })

    console.log('\n✅ Total salads found:', salads.length)
    console.log('\n⚠️  NOTE: Your seed script shows "1,2,3,4,5,6" but these are NOT the real IDs!')
    console.log('The real IDs are the cuid strings above.')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseIds()
