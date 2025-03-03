import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple credentials check
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
            role: "admin"
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to token when signing in
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Add role from token to session
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  debug: true,
}
