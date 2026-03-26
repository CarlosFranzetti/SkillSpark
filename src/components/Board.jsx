import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// ── Skill emoji mapping ──────────────────────────────────────────────────────
const SKILL_EMOJIS = {
  cooking: "🍳", cook: "🍳", excel: "📊", sewing: "🧵", sew: "🧵",
  coding: "💻", code: "💻", resume: "📝", guitar: "🎸", python: "🐍",
  photography: "📸", photo: "📸", budgeting: "💰", budget: "💰",
  writing: "✍️", write: "✍️", design: "🎨", yoga: "🧘",
  gardening: "🌱", garden: "🌱", baking: "🧁", bake: "🧁",
  music: "🎵", painting: "🖌️", paint: "🖌️", knitting: "🧶",
  knit: "🧶", dancing: "💃", dance: "💃", tutoring: "📚",
  tutor: "📚", french: "🇫🇷", spanish: "🇪🇸", arabic: "🇹🇳",
  math: "🔢", fitness: "💪", meditation: "🕯️", reading: "📖",
  language: "🗣️", figma: "🎨", react: "⚛️", sql: "🗄️",
  dj: "🎧", vinyl: "🎶", art: "🖼️", film: "🎬",
};
const FALLBACK = ["🌟","✨","🎯","🌈","🫧","🪴","🎪","🧩"];

function getEmoji(skill) {
  const lower = skill.toLowerCase();
  for (const [k, v] of Object.entries(SKILL_EMOJIS)) {
    if (lower.includes(k)) return v;
  }
  let h = 0;
  for (let i = 0; i < lower.length; i++) h = lower.charCodeAt(i) + ((h << 5) - h);
  return FALLBACK[Math.abs(h) % FALLBACK.length];
}

// ── Deterministic helpers ────────────────────────────────────────────────────
const AVATARS = ["🦊","🐸","🐼","🦋","🐙","🦜","🐨","🦈","🐝","🌻","🍄","🫧","🪷","🐳","🦩"];
function getAvatar(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATARS[Math.abs(h) % AVATARS.length];
}

const CARD_COLORS = [
  { bg: "#fef3f0", border: "#f9c4b4" },
  { bg: "#f0f4fe", border: "#b4ccf9" },
  { bg: "#eefbf3", border: "#b4f0c8" },
  { bg: "#fef0fb", border: "#f0b4e8" },
  { bg: "#fefbf0", border: "#f0deb4" },
  { bg: "#f0fbfe", border: "#b4e8f0" },
  { bg: "#f6f0fe", border: "#d0b4f0" },
];
function getCardColor(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return CARD_COLORS[Math.abs(h) % CARD_COLORS.length];
}

// O(n²) match: for each post find who wants what they offer
function getMatches(posts) {
  const map = {};
  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      if (i === j) continue;
      if (posts[i].offer.toLowerCase().trim() === posts[j].want.toLowerCase().trim()) {
        if (!map[posts[i].id]) map[posts[i].id] = [];
        map[posts[i].id].push(posts[j].name);
      }
    }
  }
  return map;
}

// ── Board ────────────────────────────────────────────────────────────────────
export default function Board({ user }) {
  const [posts, setPosts]   = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const matchMap = getMatches(posts);

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase().trim();
    const textMatch = !q ||
      p.offer.toLowerCase().includes(q) ||
      p.want.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      (p.note && p.note.toLowerCase().includes(q)) ||
      (p.community && p.community.toLowerCase().includes(q));
    if (filter === "offering") return textMatch && (!q || p.offer.toLowerCase().includes(q));
    if (filter === "learning") return textMatch && (!q || p.want.toLowerCase().includes(q));
    return textMatch;
  });

  return (
    <section style={{ maxWidth: 700, margin: "0 auto", padding: "38px 24px 64px" }}>
      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 24, color: "#3d3552" }}>
          🌍 The Spark Board
        </h2>
        <span style={{ fontSize: 13, color: "#b8acc8", fontWeight: 700 }}>
          {posts.length} spark{posts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔍</span>
          <input
            style={{
              width: "100%", padding: "12px 14px 12px 42px", fontSize: 14,
              fontFamily: "'Nunito',sans-serif", border: "2px solid #ece8f4",
              borderRadius: 50, background: "#fff", color: "#3d3552", transition: "all 0.2s",
            }}
            placeholder="Search skills, names, neighborhoods…"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "all",      label: "All ⚡"       },
            { key: "offering", label: "Teaching 🎓"  },
            { key: "learning", label: "Learning 🌱"  },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "10px 16px", fontSize: 13, fontWeight: 700,
              fontFamily: "'Nunito',sans-serif", border: "2px solid",
              borderColor: filter === f.key ? "transparent" : "#ece8f4",
              borderRadius: 50, cursor: "pointer",
              background: filter === f.key ? "linear-gradient(135deg,#fbc2eb,#a6c1ee)" : "#fff",
              color: filter === f.key ? "#fff" : "#a99bbe",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "56px 0", color: "#b8acc8" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #ece8f4", borderTopColor: "#c77bba", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          Loading sparks…
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((p, i) => (
            <Card key={p.id} post={p} matchNames={matchMap[p.id]} index={i}
              isOwner={p.userId === user.uid}
              onDelete={async () => { await deleteDoc(doc(db, "posts", p.id)); }}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "56px 24px", color: "#b8acc8", fontSize: 16 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🔮</div>
          No sparks found{search ? ` for "${search}"` : ""}. Be the first!
        </div>
      )}
    </section>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
function Card({ post, matchNames, index, isOwner, onDelete }) {
  const hasMatch = matchNames && matchNames.length > 0;
  const c       = getCardColor(post.id);
  const avatar  = getAvatar(post.name);

  return (
    <div style={{
      background: c.bg, border: `2px solid ${isOwner ? "#c77bba" : c.border}`,
      borderRadius: 22, padding: "22px 22px 18px",
      position: "relative", overflow: "hidden",
      animation: "popUp 0.45s ease both",
      animationDelay: `${index * 0.06}s`,
      boxShadow: isOwner ? "0 4px 20px rgba(199,123,186,0.15)" : "none",
    }}>
      {/* Owner badge */}
      {isOwner && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: "#c77bba",
            background: "#fdf0ff", border: "1.5px solid #f0b4e8",
            borderRadius: 20, padding: "3px 10px",
          }}>
            Your Spark
          </span>
          <button onClick={onDelete} title="Delete" style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: "#d0a0b0", padding: 2,
          }}>
            ✕
          </button>
        </div>
      )}

      {/* Match badge */}
      {hasMatch && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "linear-gradient(135deg,#ff9a9e,#fbc2eb)",
          color: "#fff", fontSize: 11, fontWeight: 800,
          padding: "5px 14px", borderRadius: 20, marginBottom: 14,
          boxShadow: "0 2px 10px rgba(255,154,158,0.3)",
        }}>
          ✨ Spark! {matchNames.join(", ")} {matchNames.length === 1 ? "wants" : "want"} to learn this
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingRight: isOwner ? 90 : 0 }}>
        <div style={{
          width: 50, height: 50, borderRadius: 16, background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, boxShadow: "0 3px 10px rgba(0,0,0,0.06)", flexShrink: 0,
        }}>
          {avatar}
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#3d3552" }}>{post.name}</div>
          {post.community && (
            <div style={{ fontSize: 12, color: "#a99bbe", fontWeight: 600 }}>📍 {post.community}</div>
          )}
        </div>
      </div>

      {/* Skill swap */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px", background: "#fff", borderRadius: 16, padding: "12px 14px", border: "2px dashed #d8d2e4" }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a99bbe", marginBottom: 4 }}>
            Can teach {getEmoji(post.offer)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#3d3552" }}>{post.offer}</div>
        </div>
        <div style={{ fontSize: 20, color: "#d8d2e4", flexShrink: 0, animation: "wiggle 3s ease-in-out infinite" }}>⇄</div>
        <div style={{ flex: "1 1 140px", background: "#fff", borderRadius: 16, padding: "12px 14px", border: "2px dashed #f0c4b4" }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#e0936b", marginBottom: 4 }}>
            Wants to learn {getEmoji(post.want)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#3d3552" }}>{post.want}</div>
        </div>
      </div>

      {post.note && (
        <p style={{ fontSize: 13, lineHeight: 1.65, color: "#8a7ca0", fontStyle: "italic", margin: 0 }}>
          &ldquo;{post.note}&rdquo;
        </p>
      )}
    </div>
  );
}
