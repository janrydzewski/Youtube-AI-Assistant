import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

console.log("ENV CHECK ->", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
});

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
  throw new Error("Missing required environment variables for NextAuth.");
}

console.log("NextAuth is about to load with these settings:", {
  googleClientId,
  googleClientSecret,
  nextAuthSecret,
});
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube.force-ssl",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("JWT callback -> got new account:", account);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires = account.expires_at ? account.expires_at * 1000 : null;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback -> session:", session, "token:", token);
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: nextAuthSecret,
});

export { handler as GET, handler as POST };
