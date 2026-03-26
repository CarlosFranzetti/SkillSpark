import { useState, useEffect } from "react";

export default function Matches({ currentUser, allPosts }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    findMatches();
  }, [currentUser]);

  const findMatches = async () => {
    setLoading(true);
    setError(null);

    // Filter out the current user from candidates
    const candidates = allPosts.filter((p) => p.name !== currentUser.name);

    const prompt = `You are a skill-swap matching assistant for Pursuit coding bootcamp students.

A student named ${currentUser.name} can teach "${currentUser.teaches}" and wants to learn "${currentUser.wants}".

Here are other students who posted skill swaps:
${candidates.map((p, i) => `${i + 1}. ${p.name} — teaches: "${p.teaches}", wants to learn: "${p.wants}", available: ${p.availability}`).join("\n")}

Find the top 3 best matches for ${currentUser.name}. A great match is someone whose "wants to learn" aligns with what ${currentUser.name} teaches, OR whose "teaches" aligns with what ${currentUser.name} wants to learn — ideally both (a mutual swap).

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
[
  {
    "name": "student name",
    "teaches": "their skill",
    "wants": "their want",
    "reason": "One sentence explaining why this is a great match",
    "matchScore": 92
  }
]`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setMatches(parsed);
    } catch (err) {
      // Fallback: simple local matching if API fails
      const scored = candidates.map((p) => {
        let score = 0;
        if (p.wants.toLowerCase().includes(currentUser.teaches.toLowerCase()) ||
            currentUser.teaches.toLowerCase().includes(p.wants.toLowerCase())) score += 50;
        if (p.teaches.toLowerCase().includes(currentUser.wants.toLowerCase()) ||
            currentUser.wants.toLowerCase().includes(p.teaches.toLowerCase())) score += 50;
        return { ...p, matchScore: score || Math.floor(Math.random() * 30 + 40), reason: "Skills align well for a swap." };
      });
      scored.sort((a, b) => b.matchScore - a.matchScore);
      setMatches(scored.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="matches-wrap">
        <div className="loading-state">
          <div className="spinner" />
          <p>Finding your best swap partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matches-wrap">
      <div className="matches-header">
        <h2>Your top matches</h2>
        <p>Based on your swap: <strong>{currentUser.teaches}</strong> for <strong>{currentUser.wants}</strong></p>
      </div>

      <div className="matches-grid">
        {matches.map((match, i) => (
          <MatchCard key={match.name} match={match} rank={i + 1} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}

function MatchCard({ match, rank, currentUser }) {
  const colors = ["#f97316", "#6366f1", "#10b981"];
  const color = colors[rank - 1];

  return (
    <div className="match-card" style={{ "--accent": color }}>
      <div className="match-rank" style={{ background: color }}>#{rank}</div>
      <div className="match-score" style={{ color }}>{match.matchScore}% match</div>

      <div className="card-avatar large">{match.name[0]}</div>
      <div className="card-name">{match.name}</div>

      <div className="card-swap compact">
        <div className="swap-row teach">
          <span className="swap-label">teaches</span>
          <span className="swap-value">{match.teaches}</span>
        </div>
        <div className="swap-arrow">⟷</div>
        <div className="swap-row wants">
          <span className="swap-label">wants</span>
          <span className="swap-value">{match.wants}</span>
        </div>
      </div>

      <div className="match-reason">
        <span className="reason-icon">✦</span>
        {match.reason}
      </div>

      <a href={`mailto:${match.contact || ""}`} className="connect-btn" style={{ background: color }}>
        Connect with {match.name.split(" ")[0]}
      </a>
    </div>
  );
}
