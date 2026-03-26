import { useState } from "react";

const CATEGORIES = ["Tech", "Music", "Craft", "Food", "Life Skills", "Art", "Fitness", "Language", "Other"];

export default function PostForm({ onSubmit, onFindMatch }) {
  const [form, setForm] = useState({
    name: "",
    teaches: "",
    wants: "",
    category: "Tech",
    availability: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.teaches || !form.wants) return;
    setSubmitted(true);
    onSubmit(form);
  };

  const handleFindMatch = () => {
    if (!form.name || !form.teaches || !form.wants) return;
    onFindMatch(form);
  };

  return (
    <div className="post-form-wrap">
      <div className="post-form">
        <h2>Post your skill swap</h2>
        <p className="form-sub">Tell the community what you offer and what you need.</p>

        <div className="field">
          <label>Your name</label>
          <input placeholder="e.g. Marcus" value={form.name} onChange={set("name")} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>I can teach</label>
            <input placeholder="e.g. Flamenco guitar" value={form.teaches} onChange={set("teaches")} />
          </div>
          <div className="field-divider">⟷</div>
          <div className="field">
            <label>I want to learn</label>
            <input placeholder="e.g. Crochet" value={form.wants} onChange={set("wants")} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Availability</label>
            <input placeholder="e.g. Weekends, evenings" value={form.availability} onChange={set("availability")} />
          </div>
        </div>

        <div className="field">
          <label>Contact (email or @handle)</label>
          <input placeholder="e.g. you@pursuit.org" value={form.contact} onChange={set("contact")} />
        </div>

        <div className="form-actions">
          <button className="cta-btn" onClick={handleSubmit} disabled={!form.name || !form.teaches || !form.wants}>
            Post to board
          </button>
          <button className="match-btn-large" onClick={handleFindMatch} disabled={!form.name || !form.teaches || !form.wants}>
            Post + find my AI match
          </button>
        </div>

        {submitted && <p className="success-msg">Posted! Check the board.</p>}
      </div>
    </div>
  );
}
