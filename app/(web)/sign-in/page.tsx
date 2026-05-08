"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import styles from "./SignIn.module.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/home" });
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await signIn("resend", { email, callbackUrl: "/home", redirect: false });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🍴</span>
          <span className={styles.logoName}>MealSwift</span>
        </Link>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to save recipes, plan meals, and more.</p>

        {/* Google button */}
        <button className={styles.googleBtn} onClick={handleGoogle}>
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
            <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-17.7 11.7z" fill="#FF3D00"/>
            <path d="M24 45c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.6 35.9 26.9 37 24 37c-5.8 0-10.7-3.9-12.4-9.3l-7 5.4C8 40.5 15.4 45 24 45z" fill="#4CAF50"/>
            <path d="M44.5 20H24v8.5h11.8c-.9 2.7-2.6 4.9-4.9 6.4l6.6 5.6C41.6 37.2 45 31 45 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </button>

        <div className={styles.divider}><span>or</span></div>

        {/* Email magic link */}
        {sent ? (
          <div className={styles.sentBox}>
            <span className={styles.sentIcon}>📬</span>
            <p>Check your inbox! We sent a magic link to <strong>{email}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleEmail} className={styles.form}>
            <label className={styles.label} htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.emailBtn} disabled={loading}>
              {loading ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}

        <p className={styles.terms}>
          By continuing, you agree to our{" "}
          <Link href="#" className={styles.link}>Terms</Link> and{" "}
          <Link href="#" className={styles.link}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
