import z from "zod";

export const playSchema = z.object({
  name: z
    .string("plz enter your room name")
    .max(8, "name character must be at 8 char"),
  maxUser: z
    .string("you have to enter max participants")
    .max(4, "max users can be at 4"),
  roomType: z.enum(["public", "private"]),
  password: z
    .number("plz enter the password ")
    .max(8, "password must be at 8 digits")
    .optional()
    .superRefine((data, ctx) => {
      if (data.roomType === "private" && !data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password is required for private rooms",
        });
      }
    }),
});
