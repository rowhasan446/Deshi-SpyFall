"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getSoundEngine } from "../lib/sounds";
import { Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";

// Traditional Bangladeshi mystery teasers in Bengali & English
const DESHI_TEASERS = [
  { icon: "🛺", bn: "চা-এর স্টল থেকে লালবাগ কেল্লা... কে সেই গোপন স্পাই?", en: "From Tea Stall to Lalbagh Fort... Who is the Spy?" },
  { icon: "🕵️‍♂️", bn: "সতর্ক থাকুন! আপনার পাশের বন্ধুই হয়তো আজকের স্পাই!", en: "Beware! Your closest friend might be the secret Spy!" },
  { icon: "🏏", bn: "মিরপুর স্টেডিয়াম নাকি টিএসসি মোড়... স্থানটি আপনার জানা তো?", en: "Mirpur Stadium or TSC? Do you know the secret location?" },
  { icon: "🕌", bn: "সবাই জানে গোপন স্থান, শুধু একজন বাদে!", en: "Everyone knows the location... except for one!" },
  { icon: "🚢", bn: "সদরঘাট থেকে কক্সবাজার সৈকত — রহস্য ঘনীভূত হচ্ছে!", en: "From Sadarghat to Cox's Bazar — the mystery deepens!" },
];

export default function WelcomeScreen({ onEnter, isReplay = false }) {
  const [progress, setProgress] = useState(0);
  const [teaserIndex, setTeaserIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const sfx = getSoundEngine();

  // Progress loader timer
  useEffect(() => {
    const startTime = Date.now();
    const duration = isReplay ? 1500 : 2800; // slightly faster on replay

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setIsReady(true);
        // Play celebratory chime when loading finishes
        sfx.play("joined");
      }
    }, 40);

    return () => clearInterval(timer);
  }, [isReplay, sfx]);

  // Teaser quote cycler
  useEffect(() => {
    const teaserTimer = setInterval(() => {
      setTeaserIndex((prev) => (prev + 1) % DESHI_TEASERS.length);
    }, 2400);

    return () => clearInterval(teaserTimer);
  }, []);

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
        background: "radial-gradient(circle at 50% 35%, #0B192C 0%, #060911 100%)",
      }}
    >
      {/* Dynamic Background Rickshaw Art Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: "url('/bg-art.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Top Bar with Mute & Skip buttons */}
      <div className="w-full max-w-md flex items-center justify-between relative z-20 pt-2">
        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-bold text-emerald-300 tracking-wider uppercase">
            দেশি ঐতিহ্য • Traditional
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-md backdrop-blur-md"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={handleStart}
            className="text-xs font-extrabold text-amber-400 hover:text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-md hover:bg-amber-900/60"
          >
            Skip ⏩
          </button>
        </div>
      </div>

      {/* Center Traditional Alpona Artwork Container */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center w-full max-w-md">
        {/* SVG Concentric Alpona Floral Rings */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6">
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
              {/* Concentric Decorative Circles */}
              <circle cx="150" cy="150" r="142" stroke="url(#alponaGold)" strokeWidth="2.5" fill="none" strokeDasharray="6 6" />
              <circle cx="150" cy="150" r="132" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
              
              {/* Traditional 12-petal Kalka / Teardrop Floral Motif Pattern */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const cx = 150 + 137 * Math.cos(angle);
                const cy = 150 + 137 * Math.sin(angle);
                return (
                  <g key={i} transform={`translate(${cx}, ${cy}) rotate(${i * 30 + 90})`}>
                    {/* Petal Motif */}
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

          {/* Center Logo Frame with Bangladesh Colors Glow */}
          <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-br from-emerald-500 via-amber-400 to-red-500 shadow-2xl animate-float-gentle flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 border border-amber-400/40 relative overflow-hidden">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400/60 mb-1">
                <Image src="/logo.png" alt="Deshi Spyfall Logo" fill style={{ objectFit: "cover" }} priority />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                  🕵️ DESHI SPY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Title & Bengali Calligraphy */}
        <div className="space-y-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-950 via-slate-900 to-red-950 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>স্বাগতম • Welcome</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            দেশি <span className="animate-shimmer text-transparent bg-clip-text">স্পাইফল</span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wide">
            বাংলাদেশের ১ম রিয়েল-টাইম পার্টি ও গোয়েন্দা গেম
          </p>
        </div>

        {/* Cycling Bengali Mystery Teasers */}
        <div className="w-full h-16 flex items-center justify-center px-4">
          <div
            key={teaserIndex}
            className="w-full bg-slate-900/80 border border-amber-500/20 rounded-2xl p-3 shadow-lg backdrop-blur-md animate-fadeIn flex flex-col items-center justify-center text-center"
          >
            <p className="text-xs sm:text-sm font-bold text-amber-200 flex items-center justify-center gap-1.5">
              <span>{DESHI_TEASERS[teaserIndex].icon}</span>
              <span>{DESHI_TEASERS[teaserIndex].bn}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {DESHI_TEASERS[teaserIndex].en}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Entrance Action */}
      <div className="w-full max-w-md relative z-20 space-y-3 pb-4">
        {/* Progress Bar Container */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold px-1">
            <span className="text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              {isReady ? "প্রস্তুত! (Ready)" : "লোড হচ্ছে... (Loading)"}
            </span>
            <span className="text-amber-400 font-mono font-black">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-slate-950/80 rounded-full p-0.5 border border-slate-800 shadow-inner relative overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150 relative"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #006A4E 0%, #F59E0B 70%, #DC2626 100%)",
              }}
            >
              {/* Glowing animated tip */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full blur-[2px] opacity-80 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Enter Button (Appears when ready or active) */}
        {isReady ? (
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 text-white font-black text-base shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40 animate-pulse-glow"
          >
            <span>গেমটিতে প্রবেশ করুন</span>
            <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">Enter Game</span>
            <ArrowRight className="w-5 h-5 ml-1 animate-bounce" />
          </button>
        ) : (
          <div className="w-full py-3.5 px-4 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-400">
            🎭 ঐতিহ্যবাহী নকশা ও আলপনা তৈরি হচ্ছে...
          </div>
        )}

        <div className="text-[11px] text-center text-slate-500 font-medium">
          স্বত্বাধিকারী © দেশি স্পাইফল • Made for Bangladeshi Friends 🇧🇩
        </div>
      </div>
    </div>
  );
}
