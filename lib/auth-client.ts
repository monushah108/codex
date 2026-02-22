"use client";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession } = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
