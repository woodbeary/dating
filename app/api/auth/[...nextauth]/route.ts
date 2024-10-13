import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth"

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
    return {
      id: profile.data.id,
      name: profile.data.name,
      email: null, // X doesn't provide email by default
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
  // Add any additional configuration here
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
