import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

if (!process.env.X_OAUTH_CLIENT_ID || !process.env.X_OAUTH_CLIENT_SECRET) {
  throw new Error('Missing X OAuth credentials');
}

interface XProfile {
  data: {
    id: string;
    name: string;
    profile_image_url: string;
  };
}

// Extend the built-in session type
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// Custom X Provider
const XProvider = (options: OAuthUserConfig<any>): OAuthConfig<any> => ({
  id: "x",
  name: "X",
  type: "oauth",
  authorization: {
    url: "https://twitter.com/i/oauth2/authorize",
    params: { scope: "tweet.read users.read offline.access" }
  },
  token: "https://api.twitter.com/2/oauth2/token",
  userinfo: {
    url: "https://api.twitter.com/2/users/me",
    params: { "user.fields": "profile_image_url" }
  },
  profile(profile: XProfile) {
    console.log("X Profile:", profile);  // Add this line for debugging
    return {
      id: profile.data.id,
      name: profile.data.name,
      email: null,
      image: profile.data.profile_image_url,
    }
  },
  style: {
    logo: "/x-logo.svg",
    logoDark: "/x-logo-dark.svg",
    bgDark: "#000000",
    bg: "#ffffff",
    text: "#000000",
    textDark: "#ffffff",
  },
  options
})

const authOptions: NextAuthOptions = {
  providers: [
    XProvider({
      clientId: process.env.X_OAUTH_CLIENT_ID,
      clientSecret: process.env.X_OAUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback - Token:", token, "User:", user, "Account:", account);  // Add this line
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: JWT }) {
      console.log("Session Callback - Session:", session, "Token:", token);  // Add this line
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: true,  // Add this line to enable debug logs
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
