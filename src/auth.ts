import { db } from "@/database"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { users } from "./database/schema/auth"
import { comparePasswords } from "./lib/auth/session"
import { userAuthSchema } from "./lib/validator/auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const validatedFields = await userAuthSchema.parseAsync(credentials)

        const { email, password } = validatedFields

        if (!email || !password) {
          return null
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        })

        if (user && user.password) {
          const isPasswordValid = await comparePasswords(
            password,
            user.password
          )

          if (isPasswordValid) {
            return {
              id: user.id,
              image: user.image,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }
        }

        return null
      },
    }),
  ],
})
