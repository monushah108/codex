import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

export const socialAuth = async (provider: string) => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

export const emailAuth = async (email: string, password: string) => {
  const data = await authClient.signUp.email({ email, password });
};
