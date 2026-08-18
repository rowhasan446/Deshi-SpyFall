"use client";

import { useEffect, useState } from "react";

// All Bangladeshi location icons with labels
const LOCATION_ICONS = [
  { emoji: "🏏", label: "Mirpur Stadium" },
  { emoji: "🛺", label: "CNG Stand" },
  { emoji: "🕌", label: "Local Mosque" },
  { emoji: "💒", label: "Biye Bari" },
  { emoji: "🚉", label: "Kamalapur Station" },
  { emoji: "📚", label: "Coaching Center" },
  { emoji: "🛍️", label: "New Market" },
  { emoji: "🏥", label: "Government Hospital" },
  { emoji: "🎡", label: "Boishakhi Mela" },
  { emoji: "🚦", label: "Dhaka Traffic" },
  { emoji: "🏢", label: "Corporate Office" },
  { emoji: "🚢", label: "Sadharghat" },
];

// Generate random positions and animation delays for floating bubbles
function generateBubbles(count = 18) {
  return Array.from({ length: count }, (_, i) => {
    const icon = LOCATION_ICONS[i % LOCATION_ICONS.length];
    return {
      id: i,
      emoji: icon.emoji,
      label: icon.label,
      x: Math.random() * 95, // % left
      y: Math.random() * 90, // % top
      size: 32 + Math.random() * 36, // emoji size px
      duration: 8 + Math.random() * 14, // float animation seconds
      delay: Math.random() * 8, // stagger
      opacity: 0.12 + Math.random() * 0.16, // subtle
    };
  });
}

export default function AnimatedBackground() {
  const [bubbles] = useState(() => generateBubbles(18));
  const [rickshawPos, setRickshawPos] = useState(0);

  // Animate rickshaw drifting across the bottom
  useEffect(() => {
    const id = setInterval(() => {
      setRickshawPos((p) => (p >= 110 ? -15 : p + 0.12));
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Base rickshaw-art image overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg-art.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      />

      {/* Animated floating location bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute flex flex-col items-center gap-0.5"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            opacity: b.opacity,
            animation: `floatBubble ${b.duration}s ease-in-out ${b.delay}s infinite alternate`,
            willChange: "transform",
          }}
        >
          <span style={{ fontSize: b.size }}>{b.emoji}</span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#0F4C81",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              opacity: 0.7,
            }}
          >
            {b.label}
          </span>
        </div>
      ))}

      {/* Subtle gradient overlay to keep content readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(248,250,252,0.55) 0%, rgba(248,250,252,0.2) 100%)",
        }}
      />

      <style>{`
        @keyframes floatBubble {
          0%   { transform: translateY(0px) rotate(-2deg) scale(1); }
          50%  { transform: translateY(-18px) rotate(2deg) scale(1.04); }
          100% { transform: translateY(6px) rotate(-1deg) scale(0.97); }
        }
      `}</style>
    </div>
  );
}
