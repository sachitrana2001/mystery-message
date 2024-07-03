import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, message } = await request.json();
    const user = await UserModel.findOne({username});
    if (!user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 404 }
      );
    }
    if (!user.isAcceptMessage) {
      return Response.json(
        { success: false, message: "User is not accepting message" },
        { status: 400 }
      );
    }

    const newMessage = {
      content: message,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
