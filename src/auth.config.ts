import type { NextAuthConfig } from "next-auth"
import { env } from "./env.mjs"

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: env.AUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update") {
        return { ...token, ...session.user }
      }

      if (user?.id) token.id = user.id
    },
    session: async ({ session, user, trigger, token }) => {
      // @ts-expect-error
      session.user.id = token.id
      return session
    },
    authorized({ request, auth }) {
      return !!auth?.user
    },
  },
  providers: [],
} satisfies NextAuthConfig
