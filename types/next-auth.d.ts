import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }

  interface Profile {
    data?: {
      id: string;
      name: string;
      username: string;
    }
  }
}
