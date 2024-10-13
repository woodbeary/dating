import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import { db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.X_OAUTH_CLIENT_ID!,
      clientSecret: process.env.X_OAUTH_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Sign In Callback - User:", user);
      console.log("Sign In Callback - Account:", account);
      console.log("Sign In Callback - Profile:", profile);

      if (user && account && profile) {
        try {
          const userData = {
            id: user.id,
            name: user.name || null,
            email: user.email || null,
            image: user.image || null,
            username: (profile as any).data?.username || null,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            provider: account.provider,
            twitterId: (profile as any).data?.id || null,
          };

          console.log("Attempting to save user data:", userData);

          await setDoc(doc(db, "users", user.id), userData, { merge: true });
          console.log("User data successfully logged to Firestore");
        } catch (error) {
          console.error("Error logging user data to Firestore:", error);
        }
      } else {
        console.log("Missing user, account, or profile data");
      }
      return true;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);

      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  debug: true,
})

export { handler as GET, handler as POST }
