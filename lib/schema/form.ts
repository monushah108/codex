import z from "zod";
import sanitizeHtml from "sanitize-html";

const clean = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });
export const signUpSchema = z
  .object({
    name: z
      .string("please enter name")
      .min(4, "name should be 4 min")
      .max(10, "name can be at max 8 characters")
      .transform(clean),
    email: z.email("please enter email").transform(clean),
    password: z
      .string("please enter password")
      .min(5, "password should be at min 5 digit")
      .max(8, "password can be at max 8 digits")
      .transform(clean),
    confirmPassword: z.string("please confirm password").transform(clean),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.email("please enter email").transform(clean),
  password: z
    .string("please enter password")
    .min(5, "password should be at min 5 digit")
    .max(8, "password can be at max 8 digits")
    .transform(clean),
});
