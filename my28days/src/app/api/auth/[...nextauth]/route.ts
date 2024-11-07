import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/data";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter your email and password");
          }

          const user = db.getUserByEmail(credentials.email);
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          // For demo purposes, accept any password for the demo users
          if (user.email === "sarah@example.com") {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              image: user.image,
              onboardingCompleted: true,
              role: 'admin' // Set Sarah as admin
            };
          }
          
          if (user.email === "emily@example.com") {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              image: user.image,
              onboardingCompleted: false,
              role: 'doctor' // Set Emily as doctor
            };
          }

          if (user.email === "maria@example.com") {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              image: user.image,
              onboardingCompleted: false,
              role: 'patient' // Set Maria as patient
            };
          }

          throw new Error("Invalid credentials");
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.onboardingCompleted = user.onboardingCompleted;
        token.role = user.role; // Include role in token
      }

      // Handle onboarding completion update
      if (trigger === "update" && session?.data?.onboardingCompleted !== undefined) {
        token.onboardingCompleted = Boolean(session.data.onboardingCompleted);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.onboardingCompleted = token.onboardingCompleted;
        session.user.role = token.role; // Include role in session
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      if (user && typeof user.onboardingCompleted === 'undefined') {
        user.onboardingCompleted = false;
      }
      if (user && typeof user.role === 'undefined') {
        user.role = 'patient'; // Default role is patient
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
