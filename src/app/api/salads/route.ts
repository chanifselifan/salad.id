import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    
    // Fetch salads from database
    const salads = await prisma.salad.findMany({
      where: {
        isAvailable: true,
        ...(categoryId && { categoryId })
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform ingredients from string to array
    const transformedSalads = salads.map(salad => ({
      ...salad,
      ingredients: salad.ingredients ? salad.ingredients.split(', ') : []
    }))
    
    return NextResponse.json({
      success: true,
      data: transformedSalads
    })
  } catch (error) {
    console.error('Error fetching salads:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch salads'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, price, imageUrl, ingredients, calories, isVegan, isGlutenFree, categoryId } = body

    // Validation
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, slug, price, and categoryId are required' },
        { status: 400 }
      )
    }

    // Create salad
    const salad = await prisma.salad.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(price),
        imageUrl,
        ingredients: Array.isArray(ingredients) ? ingredients.join(', ') : ingredients,
        calories: calories ? parseInt(calories) : null,
        isVegan: Boolean(isVegan),
        isGlutenFree: Boolean(isGlutenFree),
        categoryId
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      data: salad
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating salad:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}