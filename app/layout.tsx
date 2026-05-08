import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MealSwift",
  description: "From pantry to plate, instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
