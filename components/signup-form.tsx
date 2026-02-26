"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { getRandomImg } from "@/lib/features";

import { redirect } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema } from "@/validation/form";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { CircleAlert } from "lucide-react";
import { Spinner } from "./ui/spinner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "email" | "password" | "confirmPassword", string[]>>
  >({});
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputErrorClass = (field?: string[]) =>
    field ? "border-destructive focus-visible:ring-destructive" : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const randomImg = await getRandomImg();
    const { success, data, error } = signUpSchema.safeParse({
      email,
      password,
      name,
      confirmPassword,
    });

    if (!success) {
      const formatted = error.flatten().fieldErrors;
      setErrors(formatted);
      return;
    }
    setLoading(true);
    const result = await authClient.signUp.email(
      {
        ...data,
        image: randomImg,
        callbackURL: "/playground",
      },
      {
        onSuccess: (data) => {
          setLoading(false);
          redirect("/playground");
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to create account");
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {/* Name */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputErrorClass(errors.name)}
                />
                {errors.name && (
                  <FieldError className="text-destructive text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <CircleAlert className="h-3 w-3" />
                    {errors.name[0]}
                  </FieldError>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputErrorClass(errors.email)}
                />
                {errors.email && (
                  <FieldError className="text-destructive text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <CircleAlert className="h-3 w-3" />
                    {errors.email[0]}
                  </FieldError>
                )}
              </Field>

              {/* Password Section */}
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  {/* Password */}
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputErrorClass(errors.password)}
                    />
                    {errors.password && (
                      <FieldError className="text-destructive text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <CircleAlert className="h-3 w-3" />
                        {errors.password[0]}
                      </FieldError>
                    )}
                  </Field>

                  {/* Confirm Password */}
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputErrorClass(errors.confirmPassword)}
                    />
                    {errors.confirmPassword && (
                      <FieldError className="text-destructive text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <CircleAlert className="h-3 w-3" />
                        {errors.confirmPassword[0]}
                      </FieldError>
                    )}
                  </Field>
                </div>

                <FieldDescription>
                  Password must be at least 8 characters long.
                </FieldDescription>
              </Field>

              {/* Submit */}
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner className="h-4 w-4" /> : "Create Account"}
                </Button>

                <FieldDescription className="text-center mt-2">
                  Already have an account?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
