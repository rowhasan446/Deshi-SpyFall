"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getSoundEngine } from "../lib/sounds";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export default function WelcomeScreen({ onEnter, isReplay = false }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let animId;
    const startTime = Date.now();
    const duration = isReplay ? 1200 : 2000;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        animId = requestAnimationFrame(tick);
      } else {
        setIsReady(true);
        try {
          getSoundEngine().play("joined");
        } catch (e) {}
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isReplay]);

  const handleStart = () => {
    try {
      getSoundEngine().play("start");
    } catch (e) {}
    setIsExiting(true);
    setTimeout(() => { onEnter?.(); }, 400);
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    getSoundEngine().setMuted(nextState);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-hidden transition-all duration-500 ${
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #0B1929 0%, #060911 100%)",
      }}
    >
      {/* Background art overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/bg-art.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          mixBlendMode: "screen",
        }}
      />

      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(15,76,129,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Top bar */}
      <div className="w-full max-w-md flex items-center justify-between relative z-20 pt-2">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full transition-all cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
          }}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted
            ? <VolumeX className="w-4 h-4" style={{ color: "#f87171" }} />
            : <Volume2 className="w-4 h-4" style={{ color: "#fbbf24" }} />
          }
        </button>

        <button
          onClick={handleStart}
          className="text-xs font-bold transition-all cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/10"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8",
            fontFamily: "'Sora', sans-serif",
            backdropFilter: "blur(8px)",
          }}
        >
          Skip ⏩
        </button>
      </div>

      {/* Center Animation */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center w-full max-w-md gap-6">
        {/* Alpona Rings */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Outer ring (counter-clockwise) */}
          <div className="absolute inset-0 animate-alpona-counter animate-alpona-pulse pointer-events-none">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <defs>
                <linearGradient id="alponaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#DC2626" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <circle cx="150" cy="150" r="142" stroke="url(#alponaGold)" strokeWidth="2" fill="none" strokeDasharray="6 6" />
              <circle cx="150" cy="150" r="130" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.35" fill="none" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const cx = 150 + 137 * Math.cos(angle);
                const cy = 150 + 137 * Math.sin(angle);
                return (
                  <g key={i} transform={`translate(${cx}, ${cy}) rotate(${i * 30 + 90})`}>
                    <path d="M 0,-10 C 6,-4 6,4 0,10 C -6,4 -6,-4 0,-10 Z" fill="#F59E0B" fillOpacity="0.85" />
                    <circle cx="0" cy="0" r="2.5" fill="#EF4444" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Inner ring (clockwise) */}
          <div className="absolute inset-4 animate-alpona-clockwise pointer-events-none">
            <svg viewBox="0 0 250 250" className="w-full h-full">
              <circle cx="125" cy="125" r="110" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.6" fill="none" strokeDasharray="12 4" />
              <circle cx="125" cy="125" r="95" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.4" fill="none" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const cx = 125 + 102 * Math.cos(angle);
                const cy = 125 + 102 * Math.sin(angle);
                return (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#006A4E" stroke="#F59E0B" strokeWidth="1.5" />
                );
              })}
            </svg>
          </div>

          {/* Center Logo */}
          <div
            className="relative animate-float-gentle"
            style={{
              width: "9rem",
              height: "9rem",
              borderRadius: "50%",
              padding: "3px",
              background: "linear-gradient(135deg, #10b981, #F59E0B, #DC2626, #0F4C81)",
              boxShadow: "0 0 40px rgba(245,158,11,0.25), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="w-full h-full rounded-full flex flex-col items-center justify-center p-3 relative overflow-hidden"
              style={{
                background: "rgba(6,9,17,0.94)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <div
                className="relative mb-1 rounded-2xl overflow-hidden"
                style={{
                  width: "4rem",
                  height: "4rem",
                  border: "2px solid rgba(245,158,11,0.4)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                <Image src="/logo.png" alt="Deshi Spyfall Logo" fill style={{ objectFit: "cover" }} priority />
              </div>
              <span
                className="text-[9px] font-black tracking-widest uppercase"
                style={{ color: "#fbbf24", fontFamily: "'Sora', sans-serif" }}
              >
                DESHI SPY
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Sora', sans-serif", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            Deshi{" "}
            <span className="animate-shimmer">Spyfall</span>
          </h1>
          <p
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "rgba(245,158,11,0.7)", fontFamily: "'Sora', sans-serif" }}
          >
            🇧🇩 Bangladeshi Party Game
          </p>
        </div>
      </div>

      {/* Bottom: loader + CTA */}
      <div className="w-full max-w-md relative z-20 space-y-4 pb-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ background: "#fbbf24" }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: "#64748b", fontFamily: "'Sora', sans-serif" }}
              >
                {isReady ? "Ready!" : "Loading..."}
              </span>
            </div>
            <span
              className="font-black text-sm tabular-nums"
              style={{ color: "#fbbf24", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {progress}%
            </span>
          </div>

          <div
            className="w-full rounded-full p-0.5 relative overflow-hidden"
            style={{
              height: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-150 relative"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #006A4E 0%, #F59E0B 60%, #DC2626 100%)",
              }}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-3 rounded-full opacity-80 animate-pulse"
                style={{ background: "rgba(255,255,255,0.8)", filter: "blur(2px)" }}
              />
            </div>
          </div>
        </div>

        {/* Start button */}
        {isReady ? (
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl text-white font-black text-lg tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 animate-pulse-glow shimmer-sweep"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg, #006A4E 0%, #F59E0B 50%, #DC2626 100%)",
              border: "1px solid rgba(245,158,11,0.3)",
              boxShadow: "0 8px 32px rgba(245,158,11,0.2), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <span>Start</span>
            <ArrowRight className="w-5 h-5 ml-1 animate-bounce" />
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 text-center rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#94a3b8",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Loading… (Click to Skip)
          </button>
        )}
      </div>
    </div>
  );
}
