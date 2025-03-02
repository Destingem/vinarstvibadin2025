import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Extend the default Session type
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  interface User {
    id: string;
    name?: string;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Admin credentials are stored in environment variables
        const validUsername = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.username === validUsername && 
          credentials?.password === validPassword
        ) {
          return { 
            id: "1", 
            name: "Admin" 
          };
        }
        
        // Return null if credentials are invalid
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
