import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "./auth.config"
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  const isAuth = !!req.auth

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/assets|favicon.ico).*)",
    "/",
    "/sign-in",
    "/sign-up",
  ],
}
