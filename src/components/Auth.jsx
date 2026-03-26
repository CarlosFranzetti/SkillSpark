import { useState } from "react";
import { supabase } from "../supabase";
import FloatingShapes from "./FloatingShapes";

export default function Auth() {
  const [mode, setMode]       = useState("login"); // "login" | "signup" | "forgot"
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccess("Check your email for a password reset link!");
        setLoading(false);
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { display_name: form.name.trim() || undefined } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
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
            {mode === "forgot"
              ? "Enter your email and we'll send a reset link."
              : mode === "login"
              ? "Welcome back! Sign in to your sparks."
              : "Create your account and start sparking."}
          </p>
        </div>

        {/* Google Sign-In */}
        {mode !== "forgot" && (
          <>
            <button onClick={handleGoogle} style={{
              width: "100%", padding: "13px", marginBottom: 14,
              background: "#fff", border: "2px solid #ece8f4", borderRadius: 50,
              fontSize: 15, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
              color: "#3d3552", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 14,
            }}>
              <div style={{ flex: 1, height: 1, background: "#ece8f4" }} />
              <span style={{ fontSize: 12, color: "#b8acc8", fontWeight: 700 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#ece8f4" }} />
            </div>
          </>
        )}

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

          {mode !== "forgot" && (
            <div>
              <Label>Password</Label>
              <input style={fieldStyle} type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required minLength={6} />
              {mode === "login" && (
                <button type="button" onClick={() => switchMode("forgot")} style={{
                  background: "none", border: "none", color: "#c77bba", fontWeight: 700,
                  fontSize: 12, fontFamily: "'Nunito', sans-serif", cursor: "pointer",
                  marginTop: 6, padding: 0,
                }}>
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {error && (
            <div style={{ background: "#fff0f0", border: "1.5px solid #f9c4b4", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#c0604a", fontWeight: 700 }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: "#f0fff4", border: "1.5px solid #b4f0c8", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#3d8b5e", fontWeight: 700 }}>
              {success}
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
            {loading
              ? "…"
              : mode === "forgot"
              ? "📧 Send Reset Link"
              : mode === "login"
              ? "⚡ Sign In"
              : "⚡ Create Account"}
          </button>
        </form>

        <p style={{ marginTop: 22, textAlign: "center", fontSize: 14, color: "#a99bbe" }}>
          {mode === "forgot" ? (
            <>
              Remember it?{" "}
              <SwitchLink onClick={() => switchMode("login")}>Back to sign in</SwitchLink>
            </>
          ) : mode === "login" ? (
            <>
              No account yet?{" "}
              <SwitchLink onClick={() => switchMode("signup")}>Sign up free</SwitchLink>
            </>
          ) : (
            <>
              Already have one?{" "}
              <SwitchLink onClick={() => switchMode("login")}>Sign in</SwitchLink>
            </>
          )}
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

function SwitchLink({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", color: "#c77bba", fontWeight: 800,
      fontSize: 14, fontFamily: "'Nunito', sans-serif", cursor: "pointer",
      textDecoration: "underline",
    }}>
      {children}
    </button>
  );
}
