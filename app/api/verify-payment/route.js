import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_LIVE_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    return Response.json({ success: true });
  } else {
    return Response.json({ success: false });
  }
}
