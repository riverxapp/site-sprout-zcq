```
/* app/api/auth/[...nextauth]/route.tsx */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/db";
```

You've defined a partial file. The build error occurs because `app/lib/auth.ts` imports `authOptions` from `@/app/api/auth/[...nextauth]/route`, but the file currently only declares `NextAuth` without exporting `authOptions` or a handler.

### Patch Plan

1.  Rewrite `app/api/auth/[...nextauth]/route.tsx` to extract the NextAuth configuration into a named `authOptions` export, then export the HTTP handlers from `NextAuth()`.
2.  Ensure the export matches the import in `app/lib/auth.ts`.

---

### File Change: app/api/auth/[...nextauth]/route.tsx

```tsx
/* app/api/auth/[...nextauth]/route.tsx */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/db";

export const authOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await getUserByEmail(credentials.email as string);
        if (!user) {
          return null;
        }
        const isValid = await compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
```

### Dependency Changes

None required. The same `next-auth`, `bcryptjs`, and `@/lib/db` are used.

### Validation Steps

1.  Run `pnpm build` (or `npm run build`) – the import error for `@/app/api/auth/[...nextauth]/route` in `app/lib/auth.ts` should resolve.
2.  Start the dev server (`pnpm dev`).
3.  Navigate to `/api/auth/signin` – you should see the Credentials sign-in form.
4.  Navigate to `/login` – should redirect to the same sign-in page (as defined in `pages.signIn`).