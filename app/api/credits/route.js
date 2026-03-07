import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import CreditModel from "@/models/Credits";
const secretKey = process.env.JWT_SECRET;
export async function GET(req) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) {
      return Response.json(
        { error: "no user id found please login" },
        { status: 400 },
      );
    }
    const credits = await CreditModel.findOne({ userId });
    return Response.json({
      success: { credits },
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const userId = await getUserId();
    const currentCredits = await CreditModel.findOne({ userId });
    let initialCreds;
    if (!currentCredits) {
      initialCreds = 0;
    } else {
      initialCreds = currentCredits.credits;
    }
    const { increment } = await req.json();
    const credits = increment === "incrBsc" && 5 + initialCreds;
    if (increment !== "incrBsc") {
      return Response.json({ error: "something went wrong" }, { status: 400 });
    }
    if (!userId) {
      return Response.json({ error: "user id not found" }, { status: 400 });
    }
    const updated = await CreditModel.findOneAndUpdate(
      { userId },
      { credits },
      { new: true, upsert: true },
    );
    return Response.json(
      {
        success: { creditsInfo: updated },
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}

const getUserId = async () => {
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
  return isVerified.userId;
};
