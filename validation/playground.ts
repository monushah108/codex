import { z } from "zod";

export const playSchema = z
  .object({
    roomName: z
      .string("plz enter your room name")
      .max(8, "name must be at most 8 characters"),

    maxUser: z
      .string("you have to enter max participants")
      .max(4, "max users can be at most 4"),

    roomType: z.enum(["public", "private"]),

    password: z.string().max(8, "password must be at most 8 digits").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.roomType === "private" && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is required for private rooms",
      });
    }
  });
