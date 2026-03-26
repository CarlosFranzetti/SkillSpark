const SHAPES = [
  { top: "6%",   left:  "4%",  size: 55, color: "#ffd6e0", delay: 0   },
  { top: "18%",  right: "7%",  size: 40, color: "#d4f0ff", delay: 1.2 },
  { top: "55%",  left:  "2%",  size: 32, color: "#e8d4ff", delay: 0.8 },
  { top: "38%",  right: "4%",  size: 48, color: "#ffe8b4", delay: 2   },
  { bottom:"18%",left:  "8%",  size: 36, color: "#d4ffe8", delay: 1.5 },
  { bottom:"25%",right:"10%",  size: 28, color: "#ffd6f0", delay: 0.4 },
];

export default function FloatingShapes() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {SHAPES.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          top: s.top, bottom: s.bottom, left: s.left, right: s.right,
          width: s.size, height: s.size,
          background: s.color, opacity: 0.45,
          borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "14px" : "50% 0 50% 50%",
          animation: `blobFloat 7s ease-in-out ${s.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}
