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

  const sfx = getSoundEngine();

  // Progress loader timer
  useEffect(() => {
    const startTime = Date.now();
    const duration = isReplay ? 1400 : 2400;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setIsReady(true);
        sfx.play("joined");
      }
    }, 35);

    return () => clearInterval(timer);
  }, [isReplay, sfx]);

  const handleStart = () => {
    sfx.play("start");
    setIsExiting(true);
    setTimeout(() => {
      onEnter?.();
    }, 450);
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sfx.setMuted(nextState);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-hidden transition-all duration-500 ${
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(circle at 50% 40%, #0B192C 0%, #060911 100%)",
      }}
    >
      {/* Background Rickshaw Art Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: "url('/bg-art.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Minimal Top Bar with Mute & Skip */}
      <div className="w-full max-w-md flex items-center justify-between relative z-20 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-md backdrop-blur-md"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        <button
          onClick={handleStart}
          className="text-xs font-bold text-slate-400 hover:text-amber-400 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-md"
        >
          Skip ⏩
        </button>
      </div>

      {/* Center Circular Alpona Animation */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center w-full max-w-md">
        {/* SVG Concentric Alpona Rings */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-5">
          {/* Outer Alpona Ring (Counter-clockwise rotation) */}
          <div className="absolute inset-0 animate-alpona-counter animate-alpona-pulse pointer-events-none">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <defs>
                <linearGradient id="alponaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#EF4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <circle cx="150" cy="150" r="142" stroke="url(#alponaGold)" strokeWidth="2.5" fill="none" strokeDasharray="6 6" />
              <circle cx="150" cy="150" r="132" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
              
              {/* 12-petal Kalka / Teardrop Floral Motif Pattern */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const cx = 150 + 137 * Math.cos(angle);
                const cy = 150 + 137 * Math.sin(angle);
                return (
                  <g key={i} transform={`translate(${cx}, ${cy}) rotate(${i * 30 + 90})`}>
                    <path
                      d="M 0,-10 C 6,-4 6,4 0,10 C -6,4 -6,-4 0,-10 Z"
                      fill="#F59E0B"
                      fillOpacity="0.85"
                    />
                    <circle cx="0" cy="0" r="2.5" fill="#EF4444" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Inner Alpona Ring (Clockwise rotation) */}
          <div className="absolute inset-4 animate-alpona-clockwise pointer-events-none">
            <svg viewBox="0 0 250 250" className="w-full h-full">
              <circle cx="125" cy="125" r="110" stroke="#10B981" strokeWidth="2" strokeOpacity="0.7" fill="none" strokeDasharray="12 4" />
              <circle cx="125" cy="125" r="95" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />

              {/* 8 Geometric Star Points */}
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

          {/* Center Logo Frame */}
          <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-br from-emerald-500 via-amber-400 to-red-500 shadow-2xl animate-float-gentle flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 border border-amber-400/40 relative overflow-hidden">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400/60 mb-1">
                <Image src="/logo.png" alt="Deshi Spyfall Logo" fill style={{ objectFit: "cover" }} priority />
              </div>
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                DESHI SPY
              </span>
            </div>
          </div>
        </div>

        {/* Clean Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
          Deshi <span className="animate-shimmer text-transparent bg-clip-text">Spyfall</span>
        </h1>
      </div>

      {/* Loading Animation & Start Button */}
      <div className="w-full max-w-md relative z-20 space-y-4 pb-6">
        {/* Loading Animation Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold px-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              {isReady ? "Ready!" : "Loading..."}
            </span>
            <span className="text-amber-400 font-mono font-black text-sm">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-slate-950/80 rounded-full p-0.5 border border-slate-800 shadow-inner relative overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150 relative"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #006A4E 0%, #F59E0B 70%, #DC2626 100%)",
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full blur-[2px] opacity-80 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Start Button */}
        {isReady ? (
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 text-white font-black text-lg tracking-wide shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40 animate-pulse-glow"
          >
            <span>Start</span>
            <ArrowRight className="w-5 h-5 ml-1 animate-bounce" />
          </button>
        ) : (
          <div className="w-full py-4 px-6 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-sm font-semibold text-slate-500">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
