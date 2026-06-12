import { z } from "zod";

export const playSchema = z
  .object({
    name: z
      .string("plz enter your room name")
      .max(15, "name must be at most 15 characters"),

    type: z.enum(["public", "private"]),
    duration: z.string().min(1, "error"),

    password: z.string().max(8, "password must be at most 8 digits").optional(),
    expiresAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "private" && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is required for private rooms",
      });
    }
  });
