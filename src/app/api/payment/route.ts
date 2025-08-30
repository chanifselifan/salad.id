import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  const body = await req.json();

  // Create Snap instance
  let snap = new midtransClient.Snap({
    isProduction: false, // true for production
    serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  });

  // Transaction details
  let parameter = {
    transaction_details: {
      order_id: "order-" + new Date().getTime(),
      gross_amount: body.amount, // amount from frontend
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: body.name,
      email: body.email,
    },
  };

  try {
    let transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token, redirect_url: transaction.redirect_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
