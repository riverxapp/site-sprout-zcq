import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/db";

export const authOptions = {
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = getUserByEmail(credentials.email as string);
        if (!user) return null;
        const isValid = await compare(credentials.password as string, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: any; user?: any }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
