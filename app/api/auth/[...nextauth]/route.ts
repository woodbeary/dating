import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
  throw new Error('Missing Twitter OAuth credentials');
}

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  // Add any additional configuration here
})

export { handler as GET, handler as POST }
