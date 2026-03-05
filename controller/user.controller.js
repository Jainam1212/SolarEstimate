import UserModel from "@/models/User";
import { generateRandonInt } from "../utils/number";
import { connectDB } from "../lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET;
export async function loginHandler(body) {
  const { userEmail, userPassword } = body;
  if (!userEmail || !userPassword) {
    return NextResponse.json(
      { error: "email/password not provided" },
      {
        status: 400,
      },
    );
  } else {
    try {
      await connectDB();
      const userExist = await UserModel.findOne(
        { userEmail: userEmail },
        { userPassword: 1, _id: 1, userId: 1 },
      );
      if (!userExist) {
        return NextResponse.json(
          {
            error: "no such user exist",
          },
          { status: 400 },
        );
      }
      const isPwdValid = bcrypt.compareSync(
        userPassword,
        userExist.userPassword,
      );
      if (!isPwdValid) {
        return NextResponse.json(
          {
            error: "invalid credentials",
          },
          { status: 401 },
        );
      }
      let userId = userExist.userId;
      const userToken = jwt.sign({ userId, userEmail }, secretKey, {
        expiresIn: "1d",
      });
      const response = NextResponse.json(
        {
          success: {
            message: "login successful",
            userToken,
          },
        },
        { status: 200 },
      );
      response.cookies.set("authToken", userToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return response;
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
}
export async function registerHandler(body) {
  const { userFirstName, userLastName, userEmail, userPassword } = body;
  if (!userEmail || !userFirstName || !userLastName || !userPassword) {
    return NextResponse.json(
      { error: "email/name/password not provided" },
      {
        status: 400,
      },
    );
  }
  const userId =
    userFirstName.substring(0, 2).toLowerCase() +
    userLastName.substring(0, 2).toLowerCase() +
    generateRandonInt(6).toString();
  const hashPwd = bcrypt.hashSync(userPassword, 10);
  const dbObj = {
    userId: userId,
    userFirstName,
    userLastName,
    userEmail,
    userPassword: hashPwd,
  };
  const newUser = new UserModel(dbObj);
  try {
    if (!secretKey) {
      return NextResponse.json(
        {
          error: "error occured while creating session for you",
        },
        { status: 500 },
      );
    }
    await connectDB();
    const userSaved = await newUser.save();
    const userToken = jwt.sign({ userId, userEmail }, secretKey, {
      expiresIn: "1d",
    });
    const response = NextResponse.json(
      {
        success: {
          message: "user registered successfully",
          newUId: userSaved.userId,
        },
      },
      { status: 201 },
    );
    response.cookies.set("authToken", userToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
