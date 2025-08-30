
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const midtransClient = require('midtrans-client');

// Initialize Midtrans Core API for verification
const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

function verifySignatureKey(payload: any, signatureKey: string): boolean {
  const orderId = payload.order_id;
  const statusCode = payload.status_code;
  const grossAmount = payload.gross_amount;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex');
    
  return hash === signatureKey;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Midtrans webhook received:', body);

    const {
      order_id,
      transaction_status,
      fraud_status,
      signature_key,
      payment_type,
      transaction_id,
      transaction_time,
      gross_amount
    } = body;

    // Verify signature
    if (!verifySignatureKey(body, signature_key)) {
      console.error('Invalid signature key');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get transaction status from Midtrans API
    let transactionResult;
    try {
      transactionResult = await coreApi.transaction.status(order_id);
      console.log('Transaction status from Midtrans:', transactionResult);
    } catch (error) {
      console.error('Failed to get transaction status from Midtrans:', error);
      return NextResponse.json(
        { error: 'Failed to verify transaction' },
        { status: 500 }
      );
    }

    // Find order in database
    const order = await prisma.order.findUnique({
      where: { orderNumber: order_id },
      include: {
        items: {
          include: {
            salad: true
          }
        }
      }
    });

    if (!order) {
      console.error(`Order not found: ${order_id}`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Determine order status and payment status based on Midtrans response
    let newOrderStatus = order.status;
    let newPaymentStatus = order.paymentStatus;

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        newPaymentStatus = 'PENDING';
      } else if (fraud_status === 'accept') {
        newPaymentStatus = 'PAID';
        newOrderStatus = 'CONFIRMED';
      }
    } else if (transaction_status === 'settlement') {
      newPaymentStatus = 'PAID';
      newOrderStatus = 'CONFIRMED';
    } else if (transaction_status === 'pending') {
      newPaymentStatus = 'PENDING';
    } else if (transaction_status === 'deny') {
      newPaymentStatus = 'FAILED';
    } else if (transaction_status === 'expire') {
      newPaymentStatus = 'FAILED';
      newOrderStatus = 'CANCELLED';
    } else if (transaction_status === 'cancel') {
      newPaymentStatus = 'FAILED';
      newOrderStatus = 'CANCELLED';
    }

    // Update order in database
    await prisma.order.update({
      where: { orderNumber: order_id },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        updatedAt: new Date(),
      }
    });

    console.log(`Order ${order_id} updated: ${newOrderStatus} / ${newPaymentStatus}`);

    // Send email notification or other business logic here
    if (newPaymentStatus === 'PAID') {
      // TODO: Send confirmation email
      // TODO: Notify kitchen/preparation system
      console.log(`Payment confirmed for order ${order_id}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({ 
    message: 'Midtrans webhook endpoint is active',
    timestamp: new Date().toISOString() 
  });
}