
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const midtransClient = require('midtrans-client');

const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('order_number');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Get transaction status from Midtrans
    const transactionStatus = await coreApi.transaction.status(orderNumber);
    
    // Find order in database
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            salad: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Determine payment and order status
    let paymentStatus = order.paymentStatus;
    let orderStatus = order.status;

    if (transactionStatus.transaction_status === 'settlement' || 
        transactionStatus.transaction_status === 'capture') {
      paymentStatus = 'PAID';
      orderStatus = 'CONFIRMED';
    } else if (transactionStatus.transaction_status === 'pending') {
      paymentStatus = 'PENDING';
    } else if (transactionStatus.transaction_status === 'deny' || 
               transactionStatus.transaction_status === 'expire' ||
               transactionStatus.transaction_status === 'cancel') {
      paymentStatus = 'FAILED';
      if (transactionStatus.transaction_status === 'expire' || 
          transactionStatus.transaction_status === 'cancel') {
        orderStatus = 'CANCELLED';
      }
    }

    // Update order if status changed
    if (paymentStatus !== order.paymentStatus || orderStatus !== order.status) {
      await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus,
          status: orderStatus,
          updatedAt: new Date(),
        }
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: orderStatus,
        paymentStatus,
        totalAmount: order.totalAmount,
        deliveryFee: order.deliveryFee,
        createdAt: order.createdAt,
        items: order.items
      },
      midtransStatus: transactionStatus
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Payment verification failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, action } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (action === 'cancel') {
      // Cancel transaction in Midtrans
      try {
        await coreApi.transaction.cancel(orderNumber);
      } catch (error) {
        console.error('Failed to cancel Midtrans transaction:', error);
        // Continue with local cancellation even if Midtrans fails
      }

      // Update order status
      await prisma.order.update({
        where: { orderNumber },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED',
          updatedAt: new Date(),
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Order action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process order action', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}