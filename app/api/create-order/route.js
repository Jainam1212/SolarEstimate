import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { productName, currency, notes } = body;
  let amount = productName === "extraApiCalls" && 10;
  if (amount != 10) {
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 400 },
    );
  }
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_LIVE_KEY_ID,
    key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
  });

  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: "receipt_" + Date.now(),
    notes,
  };

  try {
    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}
