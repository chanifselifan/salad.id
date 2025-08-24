import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const midtransClient = require('midtrans-client');

// Initialize Midtrans Core API
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    // Generate unique order number
    const orderNumber = `SALAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get customer details
    const customerDetails = session?.user ? {
      first_name: session.user.name || 'Customer',
      email: session.user.email || 'customer@salad.id',
      phone: body.customerDetails?.phone || '081234567890',
    } : {
      first_name: body.customerDetails?.name || 'Guest Customer',
      email: body.customerDetails?.email || 'guest@salad.id',
      phone: body.customerDetails?.phone || '081234567890',
    };

    // Create order in database first
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: body.totalAmount,
        deliveryFee: 10000,
        userId: session?.user?.id || null,
        customerName: customerDetails.first_name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
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
    });

    // Prepare Midtrans transaction data
    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: body.totalAmount + 10000, // Include delivery fee
      },
      customer_details: customerDetails,
      item_details: [
        ...body.items.map((item: any) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
        {
          id: 'delivery',
          price: 10000,
          quantity: 1,
          name: 'Biaya Pengiriman',
        }
      ],
    };

    // Create transaction with Midtrans
    const transaction = await snap.createTransaction(parameter);
    
    // Update order with Midtrans token
    await prisma.order.update({
      where: { id: order.id },
      data: {
        midtransToken: transaction.token,
        midtransOrderId: order.orderNumber,
      }
    });

    return NextResponse.json({
      success: true,
      transactionToken: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}