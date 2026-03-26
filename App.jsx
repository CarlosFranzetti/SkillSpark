import { useState } from "react";
import Board from "./components/Board";
import PostForm from "./components/PostForm";
import Matches from "./components/Matches";

const MOCK_POSTS = [
  { id: 1, name: "Amara", teaches: "Flamenco guitar", wants: "Python basics", category: "Music", availability: "Weekends", contact: "amara@pursuit.org" },
  { id: 2, name: "Dev", teaches: "React hooks", wants: "Salsa dancing", category: "Tech", availability: "Evenings", contact: "dev@pursuit.org" },
  { id: 3, name: "Priya", teaches: "Crochet", wants: "Public speaking", category: "Craft", availability: "Mornings", contact: "priya@pursuit.org" },
  { id: 4, name: "Marcus", teaches: "Public speaking", wants: "Crochet", category: "Life Skills", availability: "Weekends", contact: "marcus@pursuit.org" },
  { id: 5, name: "Yuki", teaches: "Japanese cooking", wants: "Graphic design", category: "Food", availability: "Saturdays", contact: "yuki@pursuit.org" },
  { id: 6, name: "Sofia", teaches: "Figma basics", wants: "Japanese cooking", category: "Tech", availability: "Flexible", contact: "sofia@pursuit.org" },
];

export default function App() {
  const [screen, setScreen] = useState("board"); // board | post | matches
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handlePost = (newPost) => {
    const post = { ...newPost, id: Date.now() };
    setPosts((prev) => [post, ...prev]);
    setCurrentUser(post);
    setScreen("board");
  };

  const handleFindMatch = async (userPost) => {
    setCurrentUser(userPost);
    setScreen("matches");
    // AI match call goes here -- see Matches.jsx
  };

  return (
    <div className="app">
      <header>
        <div className="header-inner">
          <div className="logo" onClick={() => setScreen("board")}>
            <span className="logo-mark">⟳</span>
            <span className="logo-text">SkillSwap<em>LIC</em></span>
          </div>
          <nav>
            <button className={screen === "board" ? "nav-btn active" : "nav-btn"} onClick={() => setScreen("board")}>Board</button>
            <button className={screen === "post" ? "nav-btn active" : "nav-btn"} onClick={() => setScreen("post")}>+ Post Skill</button>
            {currentUser && (
              <button className={screen === "matches" ? "nav-btn active" : "nav-btn"} onClick={() => setScreen("matches")}>My Matches</button>
            )}
          </nav>
        </div>
      </header>

      <main>
        {screen === "board" && (
          <Board posts={posts} onFindMatch={handleFindMatch} onPost={() => setScreen("post")} />
        )}
        {screen === "post" && (
          <PostForm onSubmit={handlePost} onFindMatch={handleFindMatch} />
        )}
        {screen === "matches" && (
          <Matches currentUser={currentUser} allPosts={posts} />
        )}
      </main>
    </div>
  );
}
