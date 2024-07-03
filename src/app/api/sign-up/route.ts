import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerfied: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "User already exists." },
        { status: 400 }
      );
    }

    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
    });
    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerfied) {
        return Response.json(
          { success: false, message: "User already exists with this email." },
          { status: 500 }
        );
      } else {
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry = expiryDate;
        await existingUserVerifiedByEmail.save();
      }
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserVerifiedByEmail) {
      return Response.json(
        { success: false, message: "User already exists." },
        { status: 400 }
      );
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerfied: false,
        isAcceptMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      { success: true, message: emailResponse.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      { success: false, message: "Error registering user." },
      { status: 500 }
    );
  }
}
