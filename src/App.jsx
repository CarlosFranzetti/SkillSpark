import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./components/Auth";
import Board from "./components/Board";
import PostForm from "./components/PostForm";
import FloatingShapes from "./components/FloatingShapes";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => supabase.auth.signOut();

  const handlePosted = () => {
    setShowForm(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #ece8f4", borderTopColor: "#c77bba", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  // ── Auth gate ────────────────────────────────────────────────────────────────
  if (!user) return <Auth />;

  // ── Main app ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#3d3552", background: "#fef8f5", minHeight: "100vh" }}>

      {/* HERO HEADER */}
      <header style={{
        position: "relative",
        background: "linear-gradient(155deg, #fde2e4 0%, #dfe7fd 30%, #d4f0e8 60%, #fef0d4 100%)",
        padding: "48px 24px 56px",
        textAlign: "center",
        overflow: "hidden",
      }}>
        <FloatingShapes />

        {/* Logout pill */}
        <div style={{ position: "absolute", top: 16, right: 20, zIndex: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#a99bbe", fontWeight: 700 }}>
            {user.email}
          </span>
          <button onClick={handleLogout} style={{
            background: "rgba(255,255,255,0.7)", border: "1.5px solid #e0d8f0",
            borderRadius: 50, padding: "5px 14px", fontSize: 12, fontWeight: 700,
            color: "#a99bbe",
          }}>
            Sign out
          </button>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 540, margin: "0 auto" }}>
          <div style={{ fontSize: 52, marginBottom: 10, animation: "wiggle 2.5s ease-in-out infinite" }}>⚡</div>
          <h1 style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "clamp(40px,8vw,58px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 10,
            background: "linear-gradient(135deg, #e8936b, #c77bba, #7b9fe8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            SkillSpaRK
          </h1>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#6b5e7a", marginBottom: 10 }}>
            Find your match. Teach &amp; learn. No money needed.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#a99bbe", maxWidth: 420, margin: "0 auto 28px" }}>
            Like a dating app for skills — post what you can teach and what you want to learn, and we&apos;ll spark a connection 🌱
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: showForm
                ? "#ebe7f2"
                : "linear-gradient(135deg,#ff9a9e 0%,#fbc2eb 50%,#c4b4f9 100%)",
              color: showForm ? "#8a7ca0" : "#fff",
              border: "none", borderRadius: 50, padding: "15px 38px",
              fontSize: 16, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
              boxShadow: showForm ? "none" : "0 6px 20px rgba(255,154,158,0.3)",
            }}
          >
            {showForm ? "✕ Close" : "⚡ Post a Spark"}
          </button>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 200,
          background: "linear-gradient(135deg,#a8edea,#fbc2eb)",
          color: "#3d3552", padding: "14px 32px", borderRadius: 50,
          fontSize: 15, fontWeight: 800, boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
          animation: "popUp 0.3s ease",
        }}>
          ⚡ Spark posted!
        </div>
      )}

      {/* POST FORM */}
      {showForm && <PostForm user={user} onPosted={handlePosted} />}

      {/* BOARD */}
      <Board user={user} />
    </div>
  );
}
