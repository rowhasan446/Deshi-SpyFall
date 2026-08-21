"use client";

import { useState } from "react";
import { Users, PlusCircle, LogIn, ArrowLeft, HelpCircle, Zap } from "lucide-react";
import Image from "next/image";
import { getSoundEngine } from "../lib/sounds";

export default function HomeScreen({ onCreateRoom, onJoinRoom, onOpenRules }) {
  const [mode, setMode] = useState("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [error, setError] = useState("");
  const sfx = getSoundEngine();

  const goTo = (m) => { sfx.play("click"); setError(""); setMode(m); };
  const goBack = () => { sfx.play("back"); setError(""); setMode("menu"); };

  const handleInputFocus = (e) => {
    const target = e.target;
    setTimeout(() => { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150);
    setTimeout(() => { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 450);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) { setError("Please enter your name!"); sfx.play("back"); return; }
    setError("");
    sfx.play("roomCreated");
    onCreateRoom(playerName.trim());
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) { setError("Please enter your name!"); sfx.play("back"); return; }
    if (!roomCodeInput.trim() || roomCodeInput.trim().length !== 4) { setError("Please enter a valid 4-letter Room Code!"); sfx.play("back"); return; }
    setError("");
    sfx.play("joined");
    onJoinRoom(roomCodeInput.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 py-4 animate-fadeIn">

      {/* ── Brand Hero ── */}
      <div className="text-center space-y-4 w-full">
        {/* Logo with animated glow ring */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-3xl animate-ring-glow"
              style={{
                background: "linear-gradient(135deg, #0F4C81, #006A4E, #DC2626, #F59E0B)",
                padding: "3px",
                borderRadius: "26px",
                animation: "ringGlow 2.5s ease-in-out infinite",
              }}
            />
            <div
              className="relative w-24 h-24 rounded-3xl overflow-hidden"
              style={{
                border: "3px solid transparent",
                background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #0F4C81, #006A4E, #DC2626) border-box",
                boxShadow: "0 8px 32px rgba(15,76,129,0.25), 0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Image src="/logo.png" alt="Deshi Spyfall Logo" fill style={{ objectFit: "cover" }} priority />
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            <span className="text-slate-900 dark:text-white">Deshi </span>
            <span
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #b91c1c 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Spyfall
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: "linear-gradient(to right, transparent, rgba(15,76,129,0.25))" }}
            />
            <p
              className="text-xs font-bold tracking-wide"
              style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}
            >
              🕵️ Who is the Spy?
            </p>
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: "linear-gradient(to left, transparent, rgba(15,76,129,0.25))" }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
          A party game for Bangladeshi friends in the same room.<br />One Spy, everyone else knows the location!
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="w-full text-sm font-semibold p-3.5 rounded-2xl text-center animate-slideUpIn"
          style={{
            background: "rgba(220,38,38,0.07)",
            border: "1px solid rgba(220,38,38,0.2)",
            color: "#b91c1c",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── Main Menu ── */}
      {mode === "menu" && (
        <div className="w-full space-y-3 animate-slideUpIn">
          <button
            onClick={() => goTo("create")}
            className="deshi-btn-blue shimmer-sweep w-full group"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Create Room
          </button>

          <button
            onClick={() => goTo("join")}
            className="deshi-btn-red shimmer-sweep w-full group"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            Join Room
          </button>

          <button
            onClick={() => { sfx.play("click"); onOpenRules?.(); }}
            className="deshi-btn-outline w-full"
          >
            <HelpCircle className="w-4 h-4" style={{ color: "var(--clr-blue)" }} />
            <span>📖 How to Play / কীভাবে খেলবেন?</span>
          </button>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { emoji: "🏏", label: "12 Locations" },
              { emoji: "👥", label: "3–12 Players" },
              { emoji: "⏱", label: "5–10 Min" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-3 rounded-2xl"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "0 2px 8px rgba(15,76,129,0.04)",
                }}
              >
                <span className="text-lg">{stat.emoji}</span>
                <span
                  className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center"
                  style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "0.02em" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create Room Form ── */}
      {mode === "create" && (
        <form onSubmit={handleCreateSubmit} className="deshi-card-elevated w-full space-y-5 animate-slideUpIn">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <button
              type="button"
              onClick={goBack}
              className="p-2 rounded-xl transition-all cursor-pointer hover:scale-105"
              style={{
                background: "rgba(15,76,129,0.07)",
                border: "1px solid rgba(15,76,129,0.12)",
              }}
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "var(--clr-blue)" }} />
            </button>
            <div>
              <h2
                className="text-lg font-black text-slate-900 dark:text-white"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Create a Room
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">You'll be the host</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Enter your name"
              maxLength={16}
              className="deshi-input"
              autoFocus
            />
          </div>

          <button type="submit" onClick={() => sfx.play("click")} className="deshi-btn-blue shimmer-sweep w-full">
            Create Room & Become Host 🚀
          </button>
        </form>
      )}

      {/* ── Join Room Form ── */}
      {mode === "join" && (
        <form onSubmit={handleJoinSubmit} className="deshi-card-elevated w-full space-y-5 animate-slideUpIn">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <button
              type="button"
              onClick={goBack}
              className="p-2 rounded-xl transition-all cursor-pointer hover:scale-105"
              style={{
                background: "rgba(220,38,38,0.07)",
                border: "1px solid rgba(220,38,38,0.12)",
              }}
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "var(--clr-red)" }} />
            </button>
            <div>
              <h2
                className="text-lg font-black text-slate-900 dark:text-white"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Join a Room
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enter the code from your host</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--clr-red)", fontFamily: "'Sora', sans-serif" }}
            >
              Room Code
            </label>
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              onFocus={handleInputFocus}
              placeholder="DHAK"
              maxLength={4}
              className="deshi-input deshi-input-red font-mono text-center font-black text-2xl tracking-[0.5em] uppercase"
              style={{ letterSpacing: "0.4em" }}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--clr-red)", fontFamily: "'Sora', sans-serif" }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Enter your name"
              maxLength={16}
              className="deshi-input deshi-input-red"
            />
          </div>

          <button type="submit" onClick={() => sfx.play("click")} className="deshi-btn-red shimmer-sweep w-full">
            Join Game 🎮
          </button>
        </form>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-medium">
        No account needed — share the room code verbally.
      </p>
    </div>
  );
}
