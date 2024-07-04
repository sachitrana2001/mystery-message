import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ username: credentials.identifier }],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (user.isVerfied) {
            throw new Error("Please Verify your account before login");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
      pages: {
        signIn: "/sign-in",
      },
      session: {
        strategy: "jwt",
      },
      secret: process.env.NEXTAUTH_URL_INTERNAL,
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token._id = user._id?.toString();
            token.isVerfied = user.isVerfied;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username = user.username;
          }
          return token;
        },
        async session({ session, token }) {
          if(token){
            session.user._id = token._id;
            session.user.isVerfied = token.isVerfied;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username;
          }
          return session;
        },
      },
    }),
  ],
};
