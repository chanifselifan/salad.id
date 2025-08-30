import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const midtransClient = require('midtrans-client');

// Initialize Midtrans Core API
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    console.log('Received request body:', body);
    
    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required and must be an array' },
        { status: 400 }
      );
    }

    if (!body.totalAmount || typeof body.totalAmount !== 'number') {
      return NextResponse.json(
        { error: 'Total amount is required and must be a number' },
        { status: 400 }
      );
    }

    // Verify all salad IDs exist in database
    const saladIds = body.items.map((item: any) => item.id);
    const existingSalads = await prisma.salad.findMany({
      where: {
        id: {
          in: saladIds
        }
      },
      select: {
        id: true,
        name: true,
        price: true
      }
    });

    if (existingSalads.length !== saladIds.length) {
      const missingIds = saladIds.filter((id: string) => !existingSalads.some(salad => salad.id === id));
      console.error('Missing salad IDs:', missingIds);
      return NextResponse.json(
        { error: 'Some salad items not found', missingIds },
        { status: 400 }
      );
    }
    
    // Generate unique order number
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${randomString}`;
    
    // Get customer details
    const customerDetails = session?.user ? {
      first_name: session.user.name || 'Customer',
      last_name: '',
      email: session.user.email || 'customer@salad.id',
      phone: body.customerDetails?.phone || '081234567890',
    } : {
      first_name: body.customerDetails?.name || 'Guest Customer',
      last_name: '',
      email: body.customerDetails?.email || 'guest@salad.id',
      phone: body.customerDetails?.phone || '081234567890',
    };

    // Validate customer details
    if (!customerDetails.first_name || !customerDetails.email || !customerDetails.phone) {
      return NextResponse.json(
        { error: 'Customer details are required (name, email, phone)' },
        { status: 400 }
      );
    }

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
        deliveryAddress: body.customerDetails?.address || '',
        notes: body.customerDetails?.notes || '',
        paymentMethod: 'midtrans',
        items: {
          create: body.items.map((item: any) => {
            const existingSalad = existingSalads.find(s => s.id === item.id);
            if (!existingSalad) {
              throw new Error(`Salad with ID ${item.id} not found`);
            }
            return {
              quantity: item.quantity,
              price: item.price || existingSalad.price,
              saladId: item.id
            };
          })
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

    console.log('Order created successfully:', order.orderNumber);

    // Prepare Midtrans transaction data
    const itemDetails = [
      ...body.items.map((item: any) => {
        const salad = existingSalads.find(s => s.id === item.id);
        return {
          id: item.id,
          price: item.price || salad?.price || 0,
          quantity: item.quantity,
          name: item.name || salad?.name || 'Salad Item',
        };
      }),
      {
        id: 'delivery-fee',
        price: 10000,
        quantity: 1,
        name: 'Biaya Pengiriman',
      }
    ];

    const grossAmount = body.totalAmount + 10000; // Include delivery fee

    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customerDetails.first_name,
        last_name: customerDetails.last_name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        billing_address: {
          address: body.customerDetails?.address || '',
          city: 'Jakarta',
          postal_code: '12345',
          country_code: 'IDN'
        },
        shipping_address: {
          address: body.customerDetails?.address || '',
          city: 'Jakarta',
          postal_code: '12345',
          country_code: 'IDN'
        }
      },
      item_details: itemDetails,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?order_id=${order.orderNumber}`
      }
    };

    console.log('Creating Midtrans transaction with parameter:', parameter);

    // Create transaction with Midtrans
    const transaction = await snap.createTransaction(parameter);
    
    console.log('Midtrans transaction created:', transaction);
    
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
    
    // Try to provide more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Transaction creation failed', 
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}