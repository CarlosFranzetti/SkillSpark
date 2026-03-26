import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function PostForm({ user, onPosted }) {
  const [form, setForm] = useState({ offer: "", want: "", note: "", community: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.offer.trim() && form.want.trim();

  const handleSubmit = async () => {
    if (!valid) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        name:      user.displayName || user.email.split("@")[0],
        email:     user.email,
        userId:    user.uid,
        offer:     form.offer.trim(),
        want:      form.want.trim(),
        note:      form.note.trim(),
        community: form.community.trim(),
        createdAt: serverTimestamp(),
      });
      setForm({ offer: "", want: "", note: "", community: "" });
      onPosted();
    } catch (err) {
      console.error("Post failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", fontSize: 14,
    fontFamily: "'Nunito', sans-serif",
    border: "2px solid #ece8f4", borderRadius: 16,
    background: "#faf8fd", color: "#3d3552", transition: "all 0.2s",
  };

  const fields = [
    { key: "offer",     label: "Skill I Can Teach",       ph: "e.g. Cooking, Python, Photography", req: true },
    { key: "want",      label: "Skill I Want to Learn",   ph: "e.g. Sewing, Guitar, Budgeting",    req: true },
    { key: "note",      label: "A little about you",      ph: "What motivates you?",                ta: true  },
    { key: "community", label: "Neighborhood (optional)", ph: "e.g. Harlem, Astoria"                          },
  ];

  return (
    <section style={{ padding: "0 24px", marginTop: -22, animation: "slideIn 0.4s ease", overflow: "hidden" }}>
      <div style={{
        maxWidth: 520, margin: "0 auto", background: "#fff",
        borderRadius: 26, padding: "30px 26px",
        boxShadow: "0 12px 44px rgba(61,53,82,0.08)", border: "2px solid #ece8f4",
      }}>
        <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 21, marginBottom: 4, color: "#3d3552" }}>
          Drop Your Spark ⚡
        </h2>
        <p style={{ fontSize: 13, color: "#a99bbe", marginBottom: 20 }}>
          Posting as <strong>{user.displayName || user.email}</strong>
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {fields.map(f => (
            <div key={f.key} style={{ flex: "1 1 200px", minWidth: 0 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "#b8acc8", marginBottom: 6,
              }}>
                {f.label} {f.req && <span style={{ color: "#ff9a9e" }}>*</span>}
              </label>
              {f.ta ? (
                <textarea
                  style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
                  placeholder={f.ph} value={form[f.key]}
                  onChange={set(f.key)}
                />
              ) : (
                <input style={inputStyle} placeholder={f.ph} value={form[f.key]} onChange={set(f.key)} />
              )}
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={!valid || loading} style={{
          marginTop: 20, width: "100%", padding: "15px",
          background: valid && !loading
            ? "linear-gradient(135deg,#a18cd1,#fbc2eb)"
            : "#ece8f4",
          color: valid && !loading ? "#fff" : "#b8acc8",
          border: "none", borderRadius: 50, fontSize: 16, fontWeight: 800,
          fontFamily: "'Nunito',sans-serif",
          boxShadow: valid && !loading ? "0 5px 18px rgba(161,140,209,0.35)" : "none",
          cursor: valid && !loading ? "pointer" : "not-allowed",
        }}>
          {loading ? "Posting…" : "⚡ Post My Spark"}
        </button>
      </div>
    </section>
  );
}
