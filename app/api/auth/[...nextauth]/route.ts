import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Uživatelské jméno", type: "text" },
        password: { label: "Heslo", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null
        
        const { username, password } = credentials
        
        // Ověření přihlašovacích údajů z prostředí
        if (
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "1", name: "Admin" }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Přesměrování po úspěšném přihlášení na admin dashboard
      if (url.startsWith(baseUrl)) return url
      return "/admin"
    },
  },
})

export { handler as GET, handler as POST }
