/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { recipes } from "@/lib/recipes";
import { BookmarkIcon } from "@/components/Icons";

const POSTS = [
  {
    id: 1,
    creator: "Layla M.",
    avatar: "👩‍🍳",
    handle: "@laylamakes",
    time: "2h ago",
    recipeName: "Smoky Shakshuka",
    caption: "Added roasted peppers and a drizzle of harissa to the classic recipe. The smokiness takes it to another level — my family demolished it in minutes!",
    img: "photo-1482049016688-2d3e1b311543",
    likes: 84,
    comments: 12,
    saves: 34,
    liked: false,
    emoji: "🥘",
    tags: ["quick"],
  },
  {
    id: 2,
    creator: "Marco R.",
    avatar: "👨‍🍳",
    handle: "@marcocooks",
    time: "5h ago",
    recipeName: "Pasta Night Perfection",
    caption: "Used the MealSwift pasta pomodoro as a base, then added burrata on top. Sunday dinner sorted. The key is really good San Marzano tomatoes.",
    img: "photo-1555949258-eb67b1ef0ceb",
    likes: 121,
    comments: 28,
    saves: 67,
    liked: true,
    emoji: "🍝",
    tags: ["veg"],
  },
  {
    id: 3,
    creator: "Priya S.",
    avatar: "🧑‍🍳",
    handle: "@priyaplates",
    time: "1d ago",
    recipeName: "Summer Grain Bowl",
    caption: "Swapped the farro for pearl barley and threw in some pickled onions. Such a satisfying lunch — prep the grains on Sunday and you're set for the week.",
    img: "photo-1512621776951-a57141f2eefd",
    likes: 67,
    comments: 9,
    saves: 28,
    liked: false,
    emoji: "🥗",
    tags: ["veg"],
  },
  {
    id: 4,
    creator: "James T.",
    avatar: "👨‍🍳",
    handle: "@jamestakesout",
    time: "2d ago",
    recipeName: "Baja Fish Tacos Remix",
    caption: "Turned the fish tacos into a full spread — made a mango-jalapeño salsa and it was unreal. Pro tip: warm your tortillas directly on the flame.",
    img: "photo-1565299585323-38d6b0865b47",
    likes: 93,
    comments: 19,
    saves: 41,
    liked: false,
    emoji: "🌮",
    tags: ["global"],
  },
  {
    id: 5,
    creator: "Sofia K.",
    avatar: "👩‍🍳",
    handle: "@sofiakitchen",
    time: "3d ago",
    recipeName: "Thai Basil with a Twist",
    caption: "Made this with tofu instead of chicken — it works SO well. The sauce caramelises beautifully. Served with a fried egg on top (non-negotiable).",
    img: "photo-1567620905732-2d1ec7ab7445",
    likes: 156,
    comments: 34,
    saves: 89,
    liked: false,
    emoji: "🍜",
    tags: ["global"],
  },
];

const TABS = ["Trending", "New", "Following"];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("Trending");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set([2]));

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const TRENDING_RECIPES = recipes.slice(0, 5);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="community-hero">
        <div className="community-hero-inner">
          <div>
            <h1 className="community-page-title">Community</h1>
            <p className="community-page-sub">
              See what other MealSwift cooks are making. Posting is{" "}
              <strong>coming soon</strong> — feed below is a preview.
            </p>
          </div>
          <button
            className="community-post-btn"
            disabled
            aria-disabled="true"
            title="Sharing your own creations is coming soon"
            style={{
              opacity: 0.5,
              cursor: "not-allowed",
            }}
          >
            + Share a Creation (soon)
          </button>
        </div>
      </section>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="community-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`community-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="community-layout">
        {/* Feed */}
        <div className="community-feed">
          {POSTS.map((post) => (
            <article key={post.id} className="community-post-card">
              {/* Post header */}
              <div className="community-post-header">
                <div className="community-post-avatar">{post.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div className="community-post-creator-name">{post.creator}</div>
                  <div className="community-post-creator-meta">{post.handle} · {post.time}</div>
                </div>
                <button
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--stone-400)", padding: 8,
                  }}
                  aria-label="Save post"
                >
                  <BookmarkIcon width={18} height={18} />
                </button>
              </div>

              {/* Image */}
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={`https://images.unsplash.com/${post.img}?w=800&q=80`}
                  alt={post.recipeName}
                  className="community-post-image"
                  loading="lazy"
                />
              </div>

              {/* Body */}
              <div className="community-post-body">
                <h3 className="community-post-recipe-name">{post.emoji} {post.recipeName}</h3>
                <p className="community-post-caption">{post.caption}</p>

                {/* Actions */}
                <div className="community-post-actions">
                  <button
                    className={`community-action-btn${likedIds.has(post.id) ? " liked" : ""}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    {likedIds.has(post.id) ? "♥" : "♡"}
                    {post.likes + (likedIds.has(post.id) && post.id !== 2 ? 1 : 0)}
                  </button>
                  <button className="community-action-btn">
                    💬 {post.comments}
                  </button>
                  <button className="community-action-btn">
                    <BookmarkIcon width={14} height={14} />
                    {post.saves}
                  </button>
                  <div className="community-action-spacer" />
                  <button className="community-action-btn">
                    Share ↗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside>
          {/* Trending recipes */}
          <div className="community-sidebar-widget">
            <div className="community-sidebar-widget-title">Trending this week</div>
            {TRENDING_RECIPES.map((recipe, i) => (
              <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="trending-recipe-row">
                <div
                  className="trending-recipe-emoji"
                  style={{ background: recipe.gradient }}
                >
                  {recipe.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="trending-recipe-name">{recipe.name}</div>
                  <div className="trending-recipe-stat">⭐ {recipe.rating} · {recipe.minutes} min</div>
                </div>
                <div className="trending-recipe-rank">#{i + 1}</div>
              </Link>
            ))}
          </div>

          {/* Top creators */}
          <div className="community-sidebar-widget">
            <div className="community-sidebar-widget-title">Top creators</div>
            {[
              { name: "Sofia K.", avatar: "👩‍🍳", handle: "@sofiakitchen", followers: "2.1k" },
              { name: "Marco R.", avatar: "👨‍🍳", handle: "@marcocooks", followers: "1.8k" },
              { name: "Layla M.", avatar: "👩‍🍳", handle: "@laylamakes", followers: "1.3k" },
            ].map((creator) => (
              <div
                key={creator.name}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: "1px solid var(--linen)",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--terra-pale)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 22, border: "2px solid var(--linen)", flexShrink: 0,
                }}>
                  {creator.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-900)" }}>{creator.name}</div>
                  <div style={{ fontSize: 12, color: "var(--stone-400)" }}>{creator.followers} followers</div>
                </div>
                <button style={{
                  fontSize: 12, fontWeight: 700, color: "var(--terra)",
                  background: "var(--terra-pale)", border: "1px solid var(--terra-light)",
                  borderRadius: "var(--radius-full)", padding: "5px 14px", cursor: "pointer",
                }}>
                  Follow
                </button>
              </div>
            ))}
          </div>

          {/* Language discovery */}
          <div className="community-sidebar-widget">
            <div className="community-sidebar-widget-title">Discover by language</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["🇬🇧 English", "🇫🇷 French", "🇯🇵 Japanese", "🇲🇽 Spanish", "🇩🇪 German", "🇮🇳 Hindi"].map((lang) => (
                <button key={lang} style={{
                  fontSize: 12, fontWeight: 600, color: "var(--stone-600, var(--stone-500))",
                  background: "var(--stone-100)", border: "1px solid var(--stone-200)",
                  borderRadius: "var(--radius-full)", padding: "5px 12px", cursor: "pointer",
                }}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
