import {z} from "zod";

export const signInSchema = z.object({
    identifier: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})