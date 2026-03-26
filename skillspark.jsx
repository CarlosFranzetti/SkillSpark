import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "skillspark_posts_v1";

const SAMPLE_POSTS = [
  { id: 1, name: "Amara J.", offer: "Resume Writing", want: "Basic Coding", note: "Career coach for 5 years. Would love to learn Python!", community: "Harlem" },
  { id: 2, name: "Luis M.", offer: "Cooking", want: "Excel", note: "Home chef who wants to level up at work.", community: "Washington Heights" },
  { id: 3, name: "Priya S.", offer: "Excel", want: "Sewing", note: "Data analyst by day, aspiring seamstress by night.", community: "Astoria" },
  { id: 4, name: "Tayo O.", offer: "Guitar", want: "Cooking", note: "Musician who can barely boil water. Help!", community: "Bed-Stuy" },
];

const SKILL_EMOJIS = {
  cooking: "🍳", cook: "🍳", excel: "📊", sewing: "🧵", sew: "🧵", coding: "💻", code: "💻",
  resume: "📝", guitar: "🎸", python: "🐍", photography: "📸", photo: "📸",
  budgeting: "💰", budget: "💰", writing: "✍️", write: "✍️", design: "🎨",
  yoga: "🧘", gardening: "🌱", garden: "🌱", baking: "🧁", bake: "🧁",
  music: "🎵", painting: "🖌️", paint: "🖌️", knitting: "🧶", knit: "🧶",
  dancing: "💃", dance: "💃", tutoring: "📚", tutor: "📚",
  french: "🇫🇷", spanish: "🇪🇸", arabic: "🇹🇳", math: "🔢",
  fitness: "💪", meditation: "🕯️", reading: "📖", language: "🗣️",
};

function getEmoji(skill) {
  const lower = skill.toLowerCase();
  for (const [key, emoji] of Object.entries(SKILL_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  const fallback = ["🌟", "✨", "🎯", "🌈", "🫧", "🪴", "🎪", "🧩"];
  let hash = 0;
  for (let i = 0; i < lower.length; i++) hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  return fallback[Math.abs(hash) % fallback.length];
}

function getMatches(posts) {
  const matchMap = {};
  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      if (i === j) continue;
      if (posts[i].offer.toLowerCase().trim() === posts[j].want.toLowerCase().trim()) {
        if (!matchMap[posts[i].id]) matchMap[posts[i].id] = [];
        matchMap[posts[i].id].push(posts[j].name);
      }
    }
  }
  return matchMap;
}

const AVATARS = ["🦊", "🐸", "🐼", "🦋", "🐙", "🦜", "🐨", "🦈", "🐝", "🌻", "🍄", "🫧", "🪷", "🐳", "🦩"];
function getAvatar(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATARS[Math.abs(hash) % AVATARS.length];
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
  return CARD_COLORS[Math.abs(id) % CARD_COLORS.length];
}

function FloatingShapes() {
  const shapes = [
    { top: "6%", left: "4%", size: 55, color: "#ffd6e0", delay: 0 },
    { top: "18%", right: "7%", size: 40, color: "#d4f0ff", delay: 1.2 },
    { top: "55%", left: "2%", size: 32, color: "#e8d4ff", delay: 0.8 },
    { top: "38%", right: "4%", size: 48, color: "#ffe8b4", delay: 2 },
    { bottom: "18%", left: "8%", size: 36, color: "#d4ffe8", delay: 1.5 },
    { bottom: "25%", right: "10%", size: 28, color: "#ffd6f0", delay: 0.4 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: s.top, bottom: s.bottom, left: s.left, right: s.right,
          width: s.size, height: s.size, background: s.color, opacity: 0.45,
          borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "14px" : "50% 0 50% 50%",
          animation: `blobFloat 7s ease-in-out ${s.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

function Card({ post, matchNames, index }) {
  const hasMatch = matchNames && matchNames.length > 0;
  const c = getCardColor(post.id);
  const avatar = getAvatar(post.name);

  return (
    <div style={{
      background: c.bg, border: `2px solid ${c.border}`, borderRadius: 22,
      padding: "22px 22px 18px", position: "relative", overflow: "hidden",
      animation: "popUp 0.45s ease both", animationDelay: `${index * 0.08}s`,
      cursor: "default",
    }}>
      {hasMatch && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "linear-gradient(135deg, #ff9a9e, #fbc2eb)",
          color: "#fff", fontSize: 11, fontWeight: 800,
          padding: "5px 14px", borderRadius: 20, marginBottom: 14,
          boxShadow: "0 2px 10px rgba(255,154,158,0.3)",
        }}>
          ✨ Spark! {matchNames.join(", ")} {matchNames.length === 1 ? "wants" : "want"} to learn this
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
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

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{
          flex: "1 1 140px", background: "#fff", borderRadius: 16, padding: "12px 14px",
          border: "2px dashed #d8d2e4",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a99bbe", marginBottom: 4 }}>
            Can teach {getEmoji(post.offer)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#3d3552" }}>{post.offer}</div>
        </div>
        <div style={{ fontSize: 20, color: "#d8d2e4", flexShrink: 0, animation: "wiggle 3s ease-in-out infinite" }}>⇄</div>
        <div style={{
          flex: "1 1 140px", background: "#fff", borderRadius: 16, padding: "12px 14px",
          border: "2px dashed #f0c4b4",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#e0936b", marginBottom: 4 }}>
            Wants to learn {getEmoji(post.want)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#3d3552" }}>{post.want}</div>
        </div>
      </div>

      {post.note && (
        <p style={{ fontSize: 13, lineHeight: 1.65, color: "#8a7ca0", fontStyle: "italic", margin: 0 }}>
          "{post.note}"
        </p>
      )}
    </div>
  );
}

export default function SkillSpark() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ name: "", offer: "", want: "", note: "", community: "" });
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPosts(parsed.length > 0 ? parsed : SAMPLE_POSTS);
      } else setPosts(SAMPLE_POSTS);
    } catch { setPosts(SAMPLE_POSTS); }
  }, []);

  useEffect(() => {
    if (posts.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.offer.trim() || !form.want.trim()) return;
    setPosts(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm({ name: "", offer: "", want: "", note: "", community: "" });
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 3000);
    setTimeout(() => feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const matchMap = getMatches(posts);
  const filtered = posts.filter(p => {
    const q = search.toLowerCase().trim();
    if (!q && filter === "all") return true;
    const ms = !q || p.offer.toLowerCase().includes(q) || p.want.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || (p.note && p.note.toLowerCase().includes(q));
    const mf = filter === "all" || (filter === "offering" && p.offer.toLowerCase().includes(q)) || (filter === "learning" && p.want.toLowerCase().includes(q));
    return q ? ms && (filter === "all" || mf) : ms;
  });

  const valid = form.name.trim() && form.offer.trim() && form.want.trim();

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#3d3552", background: "#fef8f5", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes popUp {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes blobFloat {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-16px) rotate(6deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 750px; }
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #dbb4f0 !important;
          box-shadow: 0 0 0 4px rgba(219,180,240,0.2);
        }
        button { transition: all 0.15s ease; }
        button:active { transform: scale(0.96) !important; }
      `}</style>

      {/* HERO */}
      <header style={{
        position: "relative",
        background: "linear-gradient(155deg, #fde2e4 0%, #dfe7fd 30%, #d4f0e8 60%, #fef0d4 100%)",
        padding: "48px 24px 56px", textAlign: "center", overflow: "hidden",
      }}>
        <FloatingShapes />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 540, margin: "0 auto" }}>
          <div style={{ fontSize: 52, marginBottom: 10, animation: "wiggle 2.5s ease-in-out infinite" }}>⚡</div>
          <h1 style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "clamp(40px, 8vw, 58px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 10,
            background: "linear-gradient(135deg, #e8936b, #c77bba, #7b9fe8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            SkillSpark
          </h1>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#6b5e7a", marginBottom: 10 }}>
            Find your match. Teach & learn. No money needed.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#a99bbe", maxWidth: 420, margin: "0 auto 28px" }}>
            Like a dating app for skills — post what you can teach and what you want to learn, and we'll spark a connection 🌱
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: showForm ? "#ebe7f2" : "linear-gradient(135deg, #ff9a9e 0%, #fbc2eb 50%, #c4b4f9 100%)",
              color: showForm ? "#8a7ca0" : "#fff",
              border: "none", borderRadius: 50, padding: "15px 38px",
              fontSize: 16, fontWeight: 800, fontFamily: "'Nunito', sans-serif",
              cursor: "pointer",
              boxShadow: showForm ? "none" : "0 6px 20px rgba(255,154,158,0.3)",
            }}
          >
            {showForm ? "✕ Close" : "⚡ Post a Spark"}
          </button>
        </div>
      </header>

      {/* TOAST */}
      {submitted && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 100,
          background: "linear-gradient(135deg, #a8edea, #fbc2eb)",
          color: "#3d3552", padding: "14px 32px", borderRadius: 50,
          fontSize: 15, fontWeight: 800, boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
          animation: "popUp 0.3s ease",
        }}>
          ⚡ Spark posted!
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <section style={{ padding: "0 24px", marginTop: -22, animation: "slideIn 0.4s ease", overflow: "hidden" }}>
          <div style={{
            maxWidth: 520, margin: "0 auto", background: "#fff",
            borderRadius: 26, padding: "30px 26px",
            boxShadow: "0 12px 44px rgba(61,53,82,0.08)", border: "2px solid #ece8f4",
          }}>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 21, marginBottom: 4, color: "#3d3552" }}>
              Drop Your Spark ⚡
            </h2>
            <p style={{ fontSize: 13, color: "#a99bbe", marginBottom: 20 }}>What can you teach, and what do you want to learn?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {[
                { key: "name", label: "Your Name", ph: "e.g. Amara J.", req: true, full: true },
                { key: "offer", label: "Skill I Can Teach", ph: "e.g. Cooking, Python, Photography", req: true },
                { key: "want", label: "Skill I Want to Learn", ph: "e.g. Sewing, Guitar, Budgeting", req: true },
                { key: "note", label: "A little about you", ph: "What motivates you?", ta: true, full: true },
                { key: "community", label: "Neighborhood (optional)", ph: "e.g. Harlem, Astoria", full: true },
              ].map(f => (
                <div key={f.key} style={{ flex: f.full ? "1 1 100%" : "1 1 200px", minWidth: 0 }}>
                  <label style={{
                    display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.08em", color: "#b8acc8", marginBottom: 6,
                  }}>
                    {f.label} {f.req && <span style={{ color: "#ff9a9e" }}>*</span>}
                  </label>
                  {f.ta ? (
                    <textarea
                      style={{
                        width: "100%", padding: "12px 14px", fontSize: 14,
                        fontFamily: "'Nunito', sans-serif", border: "2px solid #ece8f4",
                        borderRadius: 16, background: "#faf8fd", color: "#3d3552",
                        minHeight: 56, resize: "vertical", transition: "all 0.2s",
                      }}
                      placeholder={f.ph} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      style={{
                        width: "100%", padding: "12px 14px", fontSize: 14,
                        fontFamily: "'Nunito', sans-serif", border: "2px solid #ece8f4",
                        borderRadius: 16, background: "#faf8fd", color: "#3d3552",
                        transition: "all 0.2s",
                      }}
                      placeholder={f.ph} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} style={{
              marginTop: 20, width: "100%", padding: "15px",
              background: valid ? "linear-gradient(135deg, #a18cd1, #fbc2eb)" : "#ece8f4",
              color: valid ? "#fff" : "#b8acc8",
              border: "none", borderRadius: 50, fontSize: 16, fontWeight: 800,
              fontFamily: "'Nunito', sans-serif", cursor: valid ? "pointer" : "not-allowed",
              boxShadow: valid ? "0 5px 18px rgba(161,140,209,0.35)" : "none",
            }}>
              ⚡ Post My Spark
            </button>
          </div>
        </section>
      )}

      {/* FEED */}
      <section ref={feedRef} style={{ maxWidth: 660, margin: "0 auto", padding: "38px 24px 52px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, color: "#3d3552" }}>
            🌍 The Spark Board
          </h2>
          <span style={{ fontSize: 13, color: "#b8acc8", fontWeight: 700 }}>
            {posts.length} spark{posts.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔍</span>
            <input
              style={{
                width: "100%", padding: "12px 14px 12px 42px", fontSize: 14,
                fontFamily: "'Nunito', sans-serif", border: "2px solid #ece8f4",
                borderRadius: 50, background: "#fff", color: "#3d3552", transition: "all 0.2s",
              }}
              placeholder="Search skills, names..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "all", label: "All ⚡" },
              { key: "offering", label: "Teaching 🎓" },
              { key: "learning", label: "Learning 🌱" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "10px 16px", fontSize: 13, fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
                border: "2px solid", borderColor: filter === f.key ? "transparent" : "#ece8f4",
                borderRadius: 50, cursor: "pointer",
                background: filter === f.key ? "linear-gradient(135deg, #fbc2eb, #a6c1ee)" : "#fff",
                color: filter === f.key ? "#fff" : "#a99bbe",
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.length > 0 ? (
            filtered.map((p, i) => <Card key={p.id} post={p} matchNames={matchMap[p.id]} index={i} />)
          ) : (
            <div style={{ textAlign: "center", padding: "56px 24px", color: "#b8acc8", fontSize: 16 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🔮</div>
              No sparks found{search ? ` for "${search}"` : ""}. Be the first!
            </div>
          )}
        </div>
      </section>

      <footer style={{
        textAlign: "center", padding: "28px 24px", fontSize: 13, fontWeight: 700, color: "#b8acc8",
        background: "linear-gradient(155deg, #fde2e4 0%, #dfe7fd 50%, #d4f0e8 100%)",
      }}>
        Made with 💜 — SkillSpark: Community knowledge, one spark at a time.
      </footer>
    </div>
  );
}
