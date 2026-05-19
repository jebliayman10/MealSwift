import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Build provider list dynamically so the app boots even before every
// third-party credential is configured (e.g. first deploy). Each provider is
// only registered when its real env vars are present.
const providers: NextAuthConfig["providers"] = [];

if (
  process.env.GOOGLE_CLIENT_ID &&
  !process.env.GOOGLE_CLIENT_ID.startsWith("REPLACE_")
) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (
  process.env.RESEND_API_KEY &&
  !process.env.RESEND_API_KEY.startsWith("REPLACE_")
) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "MealSwift <onboarding@resend.dev>",
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // The adapter persists users, accounts, sessions and — critically —
  // email verification tokens. Without it the Resend magic-link provider
  // throws at runtime the moment a real user submits their email.
  adapter: PrismaAdapter(prisma),
  providers,
  trustHost: true,
  session: { strategy: "database" },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    // Expose the user id on the session so server actions can scope data.
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
    authorized() {
      // All pages are public; data-mutating server actions enforce auth
      // individually via getCurrentUserId().
      return true;
    },
  },
});
