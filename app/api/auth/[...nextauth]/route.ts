import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

if (!process.env.X_OAUTH_CLIENT_ID || !process.env.X_OAUTH_CLIENT_SECRET) {
  throw new Error('Missing X OAuth credentials');
}

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.X_OAUTH_CLIENT_ID,
      clientSecret: process.env.X_OAUTH_CLIENT_SECRET,
    }),
  ],
  // Add any additional configuration here
})

export { handler as GET, handler as POST }
