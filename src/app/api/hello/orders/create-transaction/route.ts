import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple transaction creation without Midtrans for now
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate unique order number
    const orderNumber = `SALAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: body.totalAmount,
        deliveryFee: 10000,
        customerName: body.customerDetails?.name || 'Guest Customer',
        customerEmail: body.customerDetails?.email || 'guest@salad.id',
        customerPhone: body.customerDetails?.phone || '081234567890',
        deliveryAddress: body.customerDetails?.address,
        paymentMethod: 'midtrans',
        items: {
          create: body.items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            saladId: item.id
          }))
        }
      },
      include: {
        items: {
          include: {
            salad: true
          }
        }
      }
    })

    // For now, return a mock transaction token
    // Later you can integrate real Midtrans API
    const mockToken = `mock-token-${orderNumber}`

    return NextResponse.json({
      success: true,
      transactionToken: mockToken,
      orderId: order.id,
      orderNumber: order.orderNumber
    })

  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}