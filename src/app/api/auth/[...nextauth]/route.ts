import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "customer", // Default role for Google login
        };
      },
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.otp) return null;

        const cookieStore = await cookies();
        const token = cookieStore.get("otp_session")?.value;

        if (!token) throw new Error("OTP session expired or not found. Please request a new one.");

        try {
          const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback_secret") as {
            email: string;
            otpHash: string;
          };

          if (decoded.email !== credentials.email) {
            throw new Error("Invalid email for this OTP");
          }

          const providedOtpHash = crypto.createHash("sha256").update(credentials.otp).digest("hex");

          if (decoded.otpHash !== providedOtpHash) {
            throw new Error("Invalid OTP");
          }

          // OTP is valid!
          return {
            id: `email_${decoded.email}`,
            name: decoded.email.split("@")[0],
            email: decoded.email,
            role: "customer",
          };
        } catch (error) {
          throw new Error("Invalid or expired OTP");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
