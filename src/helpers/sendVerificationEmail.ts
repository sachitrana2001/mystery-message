import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import { EmailTemplate } from "../../emails/VerificationEmail";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      to: email,
      subject: `Verify your account - ${username}`,
      text: `Verify your account - ${username} - ${verifyCode}`,
      from: "Acme <onboarding@resend.dev>",
      react: EmailTemplate({ username }),
    });
    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Error sending verification email" };
  }
};
