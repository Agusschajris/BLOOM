import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from './lib/prisma';

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    /* TODO : get needed values and add to schema
    async profile(profile) {
      return {...profile}
    },
    */
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, user }) {
      const [googleAccount] = await prisma.account.findMany({
        where: { userId: user.id, provider: "google" },
      });
      if (googleAccount.expires_at === null || googleAccount.expires_at * 1000 < Date.now()) {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: "refresh_token",
              refresh_token: googleAccount.refresh_token!,
            }),
          });
       
          const tokensOrError = await response.json();
       
          if (!response.ok) throw tokensOrError;
       
          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          };
       
          await prisma.account.update({
            data: {
              access_token: newTokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
              refresh_token:
                newTokens.refresh_token ?? googleAccount.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: googleAccount.providerAccountId,
              },
            },
          });
        } catch (error) {
          console.error("Error refreshing access_token", error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          session.error = "RefreshTokenError"
        }
      }
      return session
    },
  },
});
   
export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError"
  }
}