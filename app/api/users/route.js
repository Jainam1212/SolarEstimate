import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { loginHandler, registerHandler } from "@/controller/user.controller";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcrypt";
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
  await connectDB();
  const user = await UserModel.findOne({ userEmail: isVerified.userEmail });
  user.userPassword = "";
  if (!user) {
    return NextResponse.json(
      { error: "Your session has expired, please login again" },
      { status: 401 },
    );
  }
  return NextResponse.json(
    { success: { message: "success", user } },
    { status: 200 },
  );
}
export async function POST(req) {
  const body = await req.json();
  switch (body.requestType) {
    case "login":
      return loginHandler(body);
    case "signup":
      return registerHandler(body);
    // here now i have to make nodemailer send uid
    default:
      break;
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
export async function PUT(req) {
  const user = await validateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { userEmail } = user;
    let updateObj = {};
    let reqBody = await req.json();

    for (const [key, val] of Object.entries(reqBody)) {
      if (key == "userAddress") {
        await UserModel.findOneAndUpdate(
          { userEmail },
          { userAddress: val, isAddressDataAvailable: true },
        );
      } else {
        updateObj[key] = val;
      }
    }

    if (updateObj.userPassword && updateObj.userPassword.trim() !== "") {
      const hashPwd = bcrypt.hashSync(updateObj.userPassword, 10);
      updateObj.userPassword = hashPwd;
    } else {
      delete updateObj.userPassword;
    }
    const updateRes = await UserModel.findOneAndUpdate(
      { userEmail },
      updateObj,
    );
    if (!updateRes) {
      return NextResponse.json(
        {
          error: {
            message: "error occured while updating user. please try again",
          },
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { success: { message: "User updated successfully" } },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}
export async function DELETE(req) {
  const response = NextResponse.json({
    success: { message: "Successfully logged out" },
  });

  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}

// local middleware
async function validateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}
