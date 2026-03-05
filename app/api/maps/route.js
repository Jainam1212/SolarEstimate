import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import EstimateModel from "@/models/Estimates";
const secretKey = process.env.JWT_SECRET;
export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Your token has expired" },
      { status: 401 },
    );
  }
  const isVerified = await jwt.verify(token, secretKey);
  if (!isVerified) {
    return NextResponse.json(
      { error: "Your session has expired, please login again" },
      { status: 401 },
    );
  }
  try {
    await connectDB();
    const locations = await EstimateModel.find({
      userId: isVerified.userId,
    });
    if (locations && locations.length > 0) {
      return NextResponse.json(
        { success: { locations: locations } },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { success: { message: "no history" } },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
