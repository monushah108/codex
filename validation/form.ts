import z from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string("please enter name")
      .min(4, "name should be 4 min")
      .max(8, "name can be at max 8 characters"),
    email: z.email("please enter email"),
    password: z
      .string("please enter password")
      .min(5, "password should be at min 5 digit")
      .max(8, "password can be at max 8 digits"),
    confirmPassword: z.string("please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// export const signInSchema = signUpSchema.pick({ email: true, password: true });
