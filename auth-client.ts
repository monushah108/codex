import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};
const data = await authClient.signIn.social({
  provider: "google",
  // idToken: {
  //     token: // Google ID Token,
  //     accessToken: // Google Access Token
  // }
});
