import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import FloatingShapes from "./FloatingShapes";

export default function Auth() {
  const [mode, setMode]       = useState("login"); // "login" | "signup"
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        if (form.name.trim()) await updateProfile(cred.user, { displayName: form.name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
    } catch (err) {
      const msgs = {
        "auth/email-already-in-use": "That email is already registered.",
        "auth/invalid-credential":   "Wrong email or password.",
        "auth/weak-password":        "Password must be at least 6 characters.",
        "auth/invalid-email":        "Please enter a valid email.",
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%", padding: "13px 16px", fontSize: 15,
    fontFamily: "'Nunito', sans-serif",
    border: "2px solid #ece8f4", borderRadius: 16,
    background: "#faf8fd", color: "#3d3552",
    transition: "all 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "'Nunito', sans-serif", color: "#3d3552",
      background: "linear-gradient(155deg,#fde2e4 0%,#dfe7fd 30%,#d4f0e8 60%,#fef0d4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: 24,
    }}>
      <FloatingShapes />

      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 420,
        background: "#fff", borderRadius: 28, padding: "40px 36px",
        boxShadow: "0 20px 60px rgba(61,53,82,0.12)", border: "2px solid #ece8f4",
        animation: "popUp 0.4s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, animation: "wiggle 2.5s ease-in-out infinite" }}>⚡</div>
          <h1 style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 36, fontWeight: 700, lineHeight: 1.1,
            background: "linear-gradient(135deg,#e8936b,#c77bba,#7b9fe8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 6,
          }}>
            SkillSpaRK
          </h1>
          <p style={{ fontSize: 14, color: "#a99bbe", fontWeight: 600 }}>
            {mode === "login" ? "Welcome back! Sign in to your sparks." : "Create your account and start sparking."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <Label>Your Name</Label>
              <input style={fieldStyle} placeholder="e.g. Amara J." value={form.name} onChange={set("name")} />
            </div>
          )}

          <div>
            <Label>Email</Label>
            <input style={fieldStyle} type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
          </div>

          <div>
            <Label>Password</Label>
            <input style={fieldStyle} type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required minLength={6} />
          </div>

          {error && (
            <div style={{ background: "#fff0f0", border: "1.5px solid #f9c4b4", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#c0604a", fontWeight: 700 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            marginTop: 6, padding: "15px",
            background: loading ? "#ece8f4" : "linear-gradient(135deg,#ff9a9e 0%,#fbc2eb 50%,#c4b4f9 100%)",
            color: loading ? "#b8acc8" : "#fff",
            border: "none", borderRadius: 50,
            fontSize: 16, fontWeight: 800, fontFamily: "'Nunito', sans-serif",
            boxShadow: loading ? "none" : "0 6px 20px rgba(255,154,158,0.3)",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "…" : mode === "login" ? "⚡ Sign In" : "⚡ Create Account"}
          </button>
        </form>

        <p style={{ marginTop: 22, textAlign: "center", fontSize: 14, color: "#a99bbe" }}>
          {mode === "login" ? "No account yet? " : "Already have one? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{
            background: "none", border: "none", color: "#c77bba", fontWeight: 800,
            fontSize: 14, fontFamily: "'Nunito', sans-serif", cursor: "pointer",
            textDecoration: "underline",
          }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{
      display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase",
      letterSpacing: "0.08em", color: "#b8acc8", marginBottom: 6,
    }}>
      {children}
    </label>
  );
}
