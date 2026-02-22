"use server";
import { createAuthClient } from "better-auth/client";
import { headers } from "next/headers";
const authClient = createAuthClient();

export const socialSignOut = async (provider: string) => {
  return await authClient.signOut({
    provider,
    headers: headers(),
  });
};

export const emailAuth = async (email: string, password: string) => {
  return await authClient.signUp.email({
    email,
    password,
  });
};

export const getSession = async () => {
  const session = await authClient.getSession({
    headers: headers(),
  });
  return session;
};

export const signOut = async () => {
  await authClient.signOut({
    headers: headers(),
  });
};
