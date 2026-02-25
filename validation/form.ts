import z from "zod";

export const signUpSchema = z.object({
  name: z
    .string("please enter name")
    .min(3, "name should be at min")
    .max(8, "name can be at max 8 characters"),
  email: z.email("please enter email"),
  password: z
    .string("please enter password")
    .min(5, "password should be at min 5 digit")
    .max(8, "password can be at max 8 digits"),
});

export const signInSchema = signUpSchema.pick({ email: true, password: true });
