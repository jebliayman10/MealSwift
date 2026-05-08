import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

const providers = [];

// Only add Google if real credentials are configured
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

// Only add Resend if a real API key is configured
if (
  process.env.RESEND_API_KEY &&
  !process.env.RESEND_API_KEY.startsWith("REPLACE_")
) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "MealSwift <noreply@mealswift.app>",
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized() {
      // All pages are public for now — add protected routes here later
      return true;
    },
  },
});
