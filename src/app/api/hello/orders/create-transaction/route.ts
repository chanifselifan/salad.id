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
    
    console.log('📥 Received order request:', body);

    // Check database first
    const allSalads = await prisma.salad.findMany();
    console.log('🗃️ Database salads:', allSalads.map(s => ({ id: s.id, name: s.name })));

    // Validate items
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Check if salads exist
    const requestedIds = body.items.map((item: any) => item.id);
    const existingSalads = await prisma.salad.findMany({
      where: { id: { in: requestedIds } }
    });

    const missingIds = requestedIds.filter((id: string) => 
      !existingSalads.some(salad => salad.id === id)
    );

    if (missingIds.length > 0) {
      console.log('❌ Missing salad IDs:', missingIds);
      return NextResponse.json({
        error: 'Salads not found',
        missingIds,
        availableIds: allSalads.map(s => s.id),
        message: `These salad IDs don't exist: ${missingIds.join(', ')}`
      }, { status: 400 });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: body.totalAmount,
        deliveryFee: 10000,
        userId: session?.user?.id || null,
        customerName: body.customerDetails.name,
        customerEmail: body.customerDetails.email,
        customerPhone: body.customerDetails.phone,
        deliveryAddress: body.customerDetails.address || '',
        notes: body.customerDetails.notes || '',
        paymentMethod: 'midtrans',
        items: {
          create: body.items.map((item: any) => {
            const salad = existingSalads.find(s => s.id === item.id);
            return {
              quantity: item.quantity,
              price: salad?.price || item.price,
              saladId: item.id
            };
          })
        }
      }
    });

    console.log('✅ Order created:', orderNumber);

    // Prepare Midtrans data
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
        ...body.items.map((item: any) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name
        })),
        {
          id: 'delivery',
          price: 10000,
          quantity: 1,
          name: 'Delivery Fee'
        }
      ]
    };

    // Create Midtrans transaction
    const transaction = await snap.createTransaction(parameter);

    // Update order with token
    await prisma.order.update({
      where: { id: order.id },
      data: {
        midtransToken: transaction.token,
        midtransOrderId: orderNumber
      }
    });

    return NextResponse.json({
      success: true,
      transactionToken: transaction.token,
      orderId: order.id,
      orderNumber
    });

  } catch (error) {
    console.error('💥 API Error:', error);
    return NextResponse.json({
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}