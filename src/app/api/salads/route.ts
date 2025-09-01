// src/app/api/salads/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const salads = await prisma.salad.findMany({
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log('📡 API: Serving salads with real IDs:', salads.map(s => ({id: s.id, name: s.name})));

    // Transform for easier frontend use
    const formattedSalads = salads.map((salad, index) => ({
      id: salad.id, // This is the REAL cuid
      name: salad.name,
      slug: salad.slug,
      description: salad.description,
      price: salad.price,
      imageUrl: salad.imageUrl,
      ingredients: salad.ingredients ? salad.ingredients.split(', ') : [],
      calories: salad.calories,
      isVegan: salad.isVegan,
      isGlutenFree: salad.isGlutenFree,
      isAvailable: salad.isAvailable,
      category: salad.category,
      // Add position for reference
      position: index + 1
    }));

    return NextResponse.json({
      success: true,
      salads: formattedSalads,
      total: formattedSalads.length,
      message: `Found ${formattedSalads.length} salads with real database IDs`
    });
  } catch (error) {
    console.error('❌ Error fetching salads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}