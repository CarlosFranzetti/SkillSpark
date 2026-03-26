const CATEGORY_COLORS = {
  Music: "#f97316",
  Tech: "#6366f1",
  Craft: "#ec4899",
  "Life Skills": "#10b981",
  Food: "#f59e0b",
  default: "#8b5cf6",
};

export default function Board({ posts, onFindMatch, onPost }) {
  return (
    <div className="board">
      <div className="board-hero">
        <h1>What can you teach?<br /><span>What do you want to learn?</span></h1>
        <p className="hero-sub">Pursuit students swapping skills — one lesson at a time.</p>
        <button className="cta-btn" onClick={onPost}>Post your skill swap</button>
      </div>

      <div className="board-grid">
        {posts.map((post) => (
          <SkillCard key={post.id} post={post} onFindMatch={onFindMatch} />
        ))}
      </div>
    </div>
  );
}

function SkillCard({ post, onFindMatch }) {
  const color = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.default;

  return (
    <div className="skill-card" style={{ "--accent": color }}>
      <div className="card-tag" style={{ background: color }}>{post.category}</div>
      <div className="card-avatar">{post.name[0]}</div>
      <div className="card-name">{post.name}</div>

      <div className="card-swap">
        <div className="swap-row teach">
          <span className="swap-label">teaches</span>
          <span className="swap-value">{post.teaches}</span>
        </div>
        <div className="swap-arrow">⟷</div>
        <div className="swap-row wants">
          <span className="swap-label">wants to learn</span>
          <span className="swap-value">{post.wants}</span>
        </div>
      </div>

      <div className="card-meta">
        <span>🕐 {post.availability}</span>
      </div>

      <button className="match-btn" onClick={() => onFindMatch(post)}>
        Find my match
      </button>
    </div>
  );
}
