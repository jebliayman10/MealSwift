/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BrandMark } from "@/components/website/BrandMark";
import { Globe } from "@/components/website/Globe";
import {
  PantryIcon,
  PlayIcon,
  GlobeIcon,
  CalendarIcon,
  CommunityIcon,
} from "@/components/Icons";

const STEPS = [
  {
    n: 1,
    title: "Add your ingredients",
    body: "Type or tap the ingredients already in your kitchen. Garlic, pasta, an old tomato — whatever's there.",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    alt: "Ingredients on a wooden board",
    href: "/pantry",
    cta: "Open Pantry",
  },
  {
    n: 2,
    title: "Instant recipe match",
    body: "MealSwift instantly surfaces the best recipes for exactly what you have — sorted by speed, rating, and your taste.",
    img: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80",
    alt: "Plated dish",
    href: "/home",
    cta: "Browse Recipes",
  },
  {
    n: 3,
    title: "Watch & cook",
    body: "Follow step-by-step video guides in your language. Timer, portions, tips — everything you need, nothing you don't.",
    img: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=600&q=80",
    alt: "Hands cooking",
    href: "/recipe/pasta-pomodoro",
    cta: "Try a recipe",
  },
];

const LANGS = [
  ["🇬🇧", "English"], ["🇪🇸", "Español"], ["🇫🇷", "Français"], ["🇩🇪", "Deutsch"],
  ["🇮🇹", "Italiano"], ["🇵🇹", "Português"], ["🇯🇵", "日本語"], ["🇨🇳", "中文"],
  ["🇰🇷", "한국어"], ["🇸🇦", "العربية"], ["🇮🇳", "हिन्दी"], ["🇷🇺", "Русский"],
  ["🇹🇷", "Türkçe"], ["🇳🇱", "Nederlands"], ["🇵🇱", "Polski"],
];

const CREATORS = [
  {
    name: "Sofia Ricci",
    initial: "S",
    avatarBg: "oklch(82% 0.09 40)",
    avatarFg: "oklch(44% 0.14 40)",
    title: "My Nonna's Tomato Risotto",
    img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&q=80",
    likes: 284,
    comments: 47,
    saves: 132,
  },
  {
    name: "Marcus Oyelaran",
    initial: "M",
    avatarBg: "oklch(80% 0.07 195)",
    avatarFg: "oklch(38% 0.10 195)",
    title: "West African Spiced Fish Tacos",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80",
    likes: 519,
    comments: 93,
    saves: 207,
  },
  {
    name: "Yuki Tanaka",
    initial: "Y",
    avatarBg: "oklch(88% 0.05 145)",
    avatarFg: "oklch(40% 0.10 145)",
    title: "Sesame Miso Crunch Salad",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80",
    likes: 341,
    comments: 62,
    saves: 178,
  },
];

export default function MarketingHome() {
  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-badge">
            <BrandMark size={20} />
          </span>
          <span className="nav-logo-text">
            <span className="meal">Meal</span>
            <span className="swift">Swift</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#how" className="nav-link">How it works</a>
          <a href="#features" className="nav-link">Features</a>
          <Link href="/community" className="nav-link">Community</Link>
          <Link href="/explore" className="nav-link">Global Explore</Link>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="nav-lang">
            🇬🇧 EN
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          <Link href="/home" className="nav-cta">Open the app →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" id="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            No plan needed. Just cook.
          </div>
          <h1 className="hero-headline">
            From pantry<br />to plate,<br />
            <em>instantly.</em>
          </h1>
          <p className="hero-sub">
            Tell us what&apos;s in your fridge. MealSwift finds recipes you can make right now —
            in seconds, in any language.
          </p>
          <div className="hero-actions">
            <Link href="/home" className="btn-hero-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Try MealSwift — free
            </Link>
            <a href="#how" className="btn-hero-secondary">
              See how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <Stat value="2M+"  label="Recipes available" />
          <Stat value="15"   label="Languages supported" />
          <Stat value="4.9★" label="App Store rating" />
          <Stat value="<10s" label="From pantry to recipe" />
        </div>
      </section>

      {/* ── APP ENTRY BANNER ── */}
      <div style={{
        background: "var(--parchment)",
        borderBottom: "1px solid var(--linen-dk)",
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 15, color: "var(--stone-700)", fontWeight: 500 }}>
          🎉 The full web app is live — try it right here in your browser:
        </span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "🏠 Home", href: "/home" },
            { label: "🧺 Pantry", href: "/pantry" },
            { label: "🌍 Explore", href: "/explore" },
            { label: "👥 Community", href: "/community" },
            { label: "📅 Calendar", href: "/calendar" },
            { label: "👤 Profile", href: "/profile" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--terra-dark)",
                background: "white",
                border: "1.5px solid var(--terra-light)",
                borderRadius: "9999px",
                padding: "7px 16px",
                textDecoration: "none",
                transition: "all 150ms",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div className="section-eyebrow">How it works</div>
        <h2 className="section-headline">
          Three steps to<br />
          <em>something delicious</em>
        </h2>
        <p className="section-sub">
          No meal planning, no shopping lists. Just open the app and start cooking.
        </p>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <Link key={s.n} href={s.href} className="step-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-body">{s.body}</div>
              <div className="step-img">
                <img src={s.img} alt={s.alt} loading="lazy" />
              </div>
              <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "var(--terra)", display: "flex", alignItems: "center", gap: 4 }}>
                {s.cta} →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LANGUAGE STRIP ── */}
      <div className="lang-strip">
        <div className="lang-strip-label">Available in</div>
        <div className="lang-strip-items">
          {LANGS.map(([flag, name]) => (
            <div key={name} className="lang-strip-item">
              {flag} {name}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES BENTO ── */}
      <div className="features-section" id="features">
        <div className="features-inner">
          <div className="section-eyebrow">Features</div>
          <h2 className="section-headline">
            Everything you need,<br />
            <em>nothing you don&apos;t</em>
          </h2>
          <div className="bento-grid">
            <article className="bento-card span-5">
              <div className="bento-visual">
                <img
                  src="https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80"
                  alt="Fresh ingredients"
                  loading="lazy"
                />
              </div>
              <div className="bento-body">
                <div className="bento-icon"><PantryIcon width={20} height={20} /></div>
                <div className="bento-title">Smart Pantry Matching</div>
                <div className="bento-desc">
                  Input what&apos;s in your fridge. Get recipes that use exactly those ingredients —
                  no substitutions needed.
                </div>
              </div>
            </article>

            <article className="bento-card span-7">
              <div className="bento-visual">
                <img
                  src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=900&q=80"
                  alt="Cooking video"
                  loading="lazy"
                />
              </div>
              <div className="bento-body">
                <div className="bento-icon"><PlayIcon width={20} height={20} /></div>
                <div className="bento-title">Video Cooking Guides</div>
                <div className="bento-desc">
                  Step-by-step HD video for every recipe. Pause, rewind, and follow along in your language —
                  with chef tips throughout.
                </div>
              </div>
            </article>

            <article className="bento-card span-4 dark">
              <div className="bento-visual-globe">
                <Globe width={320} height={200} radius={90} />
              </div>
              <div className="bento-body">
                <div className="bento-icon"><GlobeIcon width={20} height={20} /></div>
                <div className="bento-title">Global Explore</div>
                <div className="bento-desc">
                  Spin a 3D globe. Land on a continent. Discover its signature dishes and cook them tonight.
                </div>
              </div>
            </article>

            <article className="bento-card span-4 terra">
              <div className="bento-body" style={{ paddingTop: 36 }}>
                <div className="bento-icon"><CalendarIcon width={20} height={20} /></div>
                <div className="bento-title">Calendar Sync</div>
                <div className="bento-desc">
                  Plan your week meal by meal. Syncs with your calendar so dinner is always sorted in advance.
                </div>
              </div>
            </article>

            <article className="bento-card span-4">
              <div className="bento-visual">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
                  alt="Community cooking"
                  loading="lazy"
                />
              </div>
              <div className="bento-body">
                <div className="bento-icon"><CommunityIcon width={20} height={20} /></div>
                <div className="bento-title">Your Creations</div>
                <div className="bento-desc">
                  Share your own original recipes. Get likes, comments, and followers from food lovers worldwide.
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* ── COMMUNITY ── */}
      <section className="community-section" id="community">
        <div className="community-inner">
          <div>
            <div className="section-eyebrow">Your Creations</div>
            <h2 className="section-headline">
              Recipes made<br />by real people,<br />
              <em>for real kitchens</em>
            </h2>
            <p className="section-sub">
              Share your original recipes with food lovers around the world.
              Get likes, comments, saves — and inspiration back.
            </p>
            <Link href="/community" className="btn-hero-primary">
              Open Community
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          <div className="community-feed-preview">
            {CREATORS.map((c) => (
              <article key={c.name} className="community-post-preview">
                <div className="cpp-image">
                  <img src={c.img} alt={c.title} loading="lazy" />
                </div>
                <div className="cpp-body">
                  <div className="cpp-creator">
                    <div className="cpp-avatar" style={{ background: c.avatarBg, color: c.avatarFg }}>
                      {c.initial}
                    </div>
                    <div className="cpp-name">{c.name}</div>
                  </div>
                  <div className="cpp-title">{c.title}</div>
                  <div className="cpp-actions">
                    <span className="cpp-action" style={{ color: "var(--terra)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {c.likes}
                    </span>
                    <span className="cpp-action">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {c.comments}
                    </span>
                    <span className="cpp-action" style={{ color: "var(--amber-dark)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      {c.saves}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBE TEASER ── */}
      <div className="globe-section" id="explore">
        <div className="globe-section-content">
          <div className="section-eyebrow" style={{ color: "oklch(65% 0.10 195)" }}>Global Explore</div>
          <h2 className="section-headline" style={{ color: "white" }}>
            Spin the globe.<br />
            <em style={{ color: "oklch(76% 0.14 75)" }}>Cook the world.</em>
          </h2>
          <p style={{
            fontSize: 17,
            color: "oklch(97% 0.02 80 / 0.65)",
            lineHeight: 1.65,
            marginBottom: 32,
            maxWidth: 420,
          }}>
            Every continent, hundreds of cuisines. Stop the globe on any region and instantly explore
            its most iconic dishes.
          </p>
          <Link href="/explore" className="btn-hero-primary">Explore the globe →</Link>
        </div>
        <Globe width={500} height={500} radius={200} />
      </div>

      {/* ── DOWNLOAD CTA ── */}
      <div className="cta-section" id="download">
        <div className="cta-inner">
          <div>
            <h2 className="cta-headline">
              Ready to cook<br /><em>tonight?</em>
            </h2>
            <p className="cta-sub">
              Download free. No subscription. Just open the app, add your ingredients,
              and start cooking in under 10 seconds.
            </p>
            <div className="cta-store-btns">
              <a href="#" className="store-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="store-btn-text">
                  <span className="store-btn-small">Download on the</span>
                  <span className="store-btn-name">App Store</span>
                </div>
              </a>
              <a href="#" className="store-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M3.18 23.76c.3.17.64.22.99.13l.1-.06 10.72-6.17-2.38-2.38-9.43 8.48zm14.9-11.58L15.6 9.7 4.89.22C4.54.1 4.17.14 3.86.33l9.22 9.22 5 2.63zM20.1 10.8l-2.6-1.49-2.94 2.94 2.94 2.94 2.63-1.51c.75-.44.75-1.44-.03-1.88zM4.06 1.03L3.86.33c-.31.19-.5.52-.5.89v21.55c0 .37.19.7.5.89l.2-.73 9.22-9.22-9.22-9.68z" />
                </svg>
                <div className="store-btn-text">
                  <span className="store-btn-small">Get it on</span>
                  <span className="store-btn-name">Google Play</span>
                </div>
              </a>
            </div>
          </div>
          <div className="cta-phone-mockup">
            <div className="cta-phone">
              <div className="cta-phone-screen">
                <div className="cta-phone-overlay">
                  <div className="cta-phone-text">
                    Pasta al Pomodoro<br />
                    <span style={{ fontStyle: "italic", color: "oklch(82% 0.09 40)" }}>
                      20 min · 4 ingredients
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-grid">
          <div>
            <Link href="/" className="nav-logo" style={{ marginBottom: 12 }}>
              <span className="nav-logo-badge">
                <BrandMark size={18} />
              </span>
              <span className="nav-logo-text" style={{ fontSize: 17 }}>
                <span style={{ color: "white" }}>Meal</span>
                <span style={{ color: "oklch(76% 0.14 75)" }}>Swift</span>
              </span>
            </Link>
            <div className="footer-brand-text">
              From pantry to plate, instantly. Available in 15 languages worldwide.
            </div>
          </div>
          <FooterCol title="Product" links={[
            { label: "How it works", href: "#how" },
            { label: "Features", href: "#features" },
            { label: "Pantry Search", href: "/pantry" },
            { label: "Calendar", href: "/calendar" },
            { label: "Mobile preview", href: "/app" },
          ]} />
          <FooterCol title="Community" links={[
            { label: "Your Creations", href: "/community" },
            { label: "Global Explore", href: "/explore" },
            { label: "Browse Recipes", href: "/home" },
            { label: "Your Profile", href: "/profile" },
          ]} />
          <FooterCol title="Company" links={[
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
          ]} />
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 MealSwift. All rights reserved.</div>
          <div className="footer-langs">
            <span className="footer-lang-btn">🇬🇧 EN</span>
            <span className="footer-lang-btn">🇫🇷 FR</span>
            <span className="footer-lang-btn">🇪🇸 ES</span>
            <span className="footer-lang-btn">🇩🇪 DE</span>
            <span className="footer-lang-btn">🇯🇵 JP</span>
            <span className="footer-lang-btn">🇸🇦 AR</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="hero-stat-val">{value}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="footer-col-title">{title}</div>
      <div className="footer-links">
        {links.map((l) => (
          l.href.startsWith("#") || l.href === "#" ? (
            <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
          ) : (
            <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
          )
        ))}
      </div>
    </div>
  );
}
