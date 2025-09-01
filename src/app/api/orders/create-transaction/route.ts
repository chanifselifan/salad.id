// src/app/api/orders/create-transaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    console.log('📥 SIMPLE API: Received order request');

    // Validate items
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Get all salads sorted by creation date (for position mapping)
    const allSalads = await prisma.salad.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log('📊 SIMPLE API: Found', allSalads.length, 'salads in database');

    // Map cart items to actual salads
    const mappedItems = [];
    
    for (let i = 0; i < body.items.length; i++) {
      const cartItem = body.items[i];
      const position = parseInt(cartItem.id) - 1; // Convert "1" to index 0, "5" to index 4
      
      if (position >= 0 && position < allSalads.length) {
        const actualSalad = allSalads[position];
        mappedItems.push({
          cartItemId: cartItem.id,
          quantity: cartItem.quantity,
          price: actualSalad.price,
          saladId: actualSalad.id,
          saladName: actualSalad.name
        });
        console.log(`🔗 SIMPLE API: Mapped cart ID "${cartItem.id}" -> "${actualSalad.name}"`);
      } else {
        return NextResponse.json({
          error: `Invalid salad position: ${cartItem.id}`,
          availablePositions: allSalads.map((s, idx) => ({ position: idx + 1, name: s.name }))
        }, { status: 400 });
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Check if user exists (to avoid foreign key constraint)
    let validUserId = null;
    if (session?.user?.id) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id }
        });
        if (user) {
          validUserId = user.id;
          console.log('👤 SIMPLE API: Using authenticated user');
        }
      } catch (e) {
        console.log('⚠️ SIMPLE API: User verification failed, creating guest order');
      }
    }

    // Create order (without the complex nested create for now)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: body.totalAmount,
        deliveryFee: 10000,
        customerName: body.customerDetails.name,
        customerEmail: body.customerDetails.email,
        customerPhone: body.customerDetails.phone,
        deliveryAddress: body.customerDetails.address || '',
        notes: body.customerDetails.notes || '',
        paymentMethod: 'midtrans',
        ...(validUserId ? { userId: validUserId } : {})
      }
    });

    console.log('✅ SIMPLE API: Order created with ID:', order.id);

    // Create order items separately to avoid nested transaction issues
    for (const item of mappedItems) {
      await prisma.orderItem.create({
        data: {
          quantity: item.quantity,
          price: item.price,
          orderId: order.id,
          saladId: item.saladId
        }
      });
    }

    console.log('✅ SIMPLE API: Order items created');

    // Prepare Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: body.totalAmount + 10000
      },
      customer_details: {
        first_name: body.customerDetails.name,
        email: body.customerDetails.email,
        phone: body.customerDetails.phone
      },
      item_details: [
        ...mappedItems.map(item => ({
          id: item.saladId,
          price: item.price,
          quantity: item.quantity,
          name: item.saladName
        })),
        {
          id: 'delivery',
          price: 10000,
          quantity: 1,
          name: 'Delivery Fee'
        }
      ]
    };

    console.log('💳 SIMPLE API: Creating Midtrans transaction...');
    
    // Create Midtrans transaction
    const transaction = await snap.createTransaction(parameter);

    // Update order with Midtrans token
    await prisma.order.update({
      where: { id: order.id },
      data: {
        midtransToken: transaction.token,
        midtransOrderId: orderNumber
      }
    });

    console.log('🎉 SIMPLE API: Everything created successfully!');

    return NextResponse.json({
      success: true,
      transactionToken: transaction.token,
      orderId: order.id,
      orderNumber
    });

  } catch (error) {
    console.error('💥 SIMPLE API: Error:', error);
    return NextResponse.json({
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}