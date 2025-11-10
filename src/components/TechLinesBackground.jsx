// src/components/TechLinesBackground.jsx
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function TechLinesBackground() {
  const ref = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced]);

  const gridTransform = prefersReduced
    ? undefined
    : `translate3d(${mouse.x * 6}px, ${mouse.y * 6}px, 0)`;
  const linesTransform = prefersReduced
    ? undefined
    : `translate3d(${mouse.x * -4}px, ${mouse.y * -4}px, 0)`;
  const linesOpacity = prefersReduced ? 0.15 : 0.1;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ contain: "paint" }}
    >
      {/* grade sutil */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #6ee7e7 0 1px, transparent 1px 120px), repeating-linear-gradient(0deg, #6ee7e7 0 1px, transparent 1px 120px)",
          transform: gridTransform,
          willChange: "transform",
        }}
      />
      {/* linhas diagonais */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          mixBlendMode: "screen",
          opacity: linesOpacity,
          transform: linesTransform,
          willChange: "transform",
        }}
      >
        <defs>
          <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.8)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={-10}
            y1={i * 10}
            x2={110}
            y2={i * 10 - 30}
            stroke="url(#glow)"
            strokeWidth={0.5}
          />
        ))}
      </svg>
      {/* vinheta */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5))]" />
    </div>
  );
}

export default TechLinesBackground;
