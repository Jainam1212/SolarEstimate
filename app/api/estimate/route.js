import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import EstimateModel from "@/models/Estimates";
const secretKey = process.env.JWT_SECRET;
export async function POST(req) {
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
    const body = await req.json();
    const currentCredits = await CreditModel.findOne({
      userId: isVerified.userId,
    });
    const currentRequestsMade = await EstimateModel.find({
      userId: isVerified.userId,
    });
    if (currentRequestsMade.length > (currentCredits?.credits || 0) + 5) {
      return NextResponse.json(
        {
          error:
            "you have reached limit for ai calls for estimate, please but credits in pricing page",
        },
        { status: 400 },
      );
    }
    const dbObj = {
      userId: isVerified.userId,
      userPointers: body.locationPointers,
      userEstimateData: body.estimateData,
    };
    const newData = new EstimateModel(dbObj);
    const saved = await newData.save();
    if (saved) {
      return NextResponse.json(
        { success: { message: "saved successfully" } },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "error occured while saving data" },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
