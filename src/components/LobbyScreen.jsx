"use client";

import { Crown, Users, Clock, Play, Copy, Check, ArrowLeft, Wifi } from "lucide-react";
import { useState } from "react";
import { getSoundEngine } from "../lib/sounds";

export default function LobbyScreen({ roomCode, roomData, currentPlayerId, onStartGame, onUpdateDuration, onLeaveRoom }) {
  const [copied, setCopied] = useState(false);
  const sfx = getSoundEngine();
  const players = roomData?.players ? Object.values(roomData.players) : [];
  const isHost = roomData?.hostId === currentPlayerId;
  const currentDuration = roomData?.roundDuration || 480;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    sfx.play("click");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDuration = (v) => { sfx.play("click"); onUpdateDuration(v); };
  const handleStart = () => { sfx.play("start"); onStartGame(); };

  const durationOptions = [
    { label: "5 Min", value: 300 },
    { label: "8 Min", value: 480 },
    { label: "10 Min", value: 600 },
  ];

  // Color palette for avatars
  const avatarColors = [
    "linear-gradient(135deg, #0F4C81, #2563EB)",
    "linear-gradient(135deg, #006A4E, #059669)",
    "linear-gradient(135deg, #7c3aed, #a78bfa)",
    "linear-gradient(135deg, #c2410c, #f97316)",
    "linear-gradient(135deg, #0e7490, #06b6d4)",
    "linear-gradient(135deg, #be185d, #ec4899)",
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4 py-3 animate-fadeIn">

      {/* Back button row */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => { sfx.play("back"); onLeaveRoom?.(); }}
          className="flex items-center gap-2 text-xs font-bold cursor-pointer transition-all py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group"
          style={{ fontFamily: "'Sora', sans-serif", color: "#64748b" }}
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Leave Room
        </button>
        <div className="deshi-badge-blue">
          <Wifi className="w-3 h-3" />
          Lobby
        </div>
      </div>

      {/* ── Room Code Card ── */}
      <div
        className="w-full rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15,76,129,0.05) 0%, rgba(15,76,129,0.02) 100%)",
          border: "1px solid rgba(15,76,129,0.15)",
          boxShadow: "0 4px 24px rgba(15,76,129,0.08)",
        }}
      >
        <div className="p-5 text-center space-y-3">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}
            >
              Share This Code
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Ask your friends to enter this</p>
          </div>

          {/* Code display */}
          <button
            onClick={handleCopyCode}
            className="w-full group cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(15,76,129,0.08), rgba(37,99,235,0.06))",
                border: "1.5px solid rgba(15,76,129,0.18)",
                boxShadow: copied ? "0 0 20px rgba(15,76,129,0.15)" : "none",
              }}
            >
              <span
                className="text-5xl font-black tracking-[0.35em]"
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  background: "linear-gradient(135deg, #0F4C81, #2563EB)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {roomCode}
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: copied ? "rgba(16,185,129,0.1)" : "rgba(15,76,129,0.08)",
                  border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(15,76,129,0.15)"}`,
                }}
              >
                {copied
                  ? <Check className="w-4 h-4" style={{ color: "#10b981" }} />
                  : <Copy className="w-4 h-4" style={{ color: "var(--clr-blue)" }} />
                }
              </div>
            </div>
          </button>

          <p className="text-[11px] font-semibold" style={{ color: copied ? "#10b981" : "#94a3b8" }}>
            {copied ? "✓ Copied to clipboard!" : "Tap to copy"}
          </p>
        </div>
      </div>

      {/* ── Players Card ── */}
      <div className="deshi-card w-full space-y-3">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <h2
            className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            <Users className="w-4 h-4" style={{ color: "var(--clr-blue)" }} />
            Players
          </h2>
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-black tabular-nums"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #0F4C81, #2563EB)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {players.length}
            </span>
            <div className="deshi-badge-blue">Need 3+</div>
          </div>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto">
          {players.map((p, idx) => {
            const isMe = p.id === currentPlayerId;
            const isRoomHost = p.id === roomData.hostId;
            const avatarGradient = avatarColors[idx % avatarColors.length];
            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl transition-all"
                style={{
                  background: isMe
                    ? "rgba(15,76,129,0.06)"
                    : "rgba(248,250,252,0.7)",
                  border: `1px solid ${isMe ? "rgba(15,76,129,0.15)" : "rgba(226,232,240,0.7)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="deshi-avatar w-9 h-9 rounded-xl text-sm"
                    style={{ background: avatarGradient, fontFamily: "'Sora', sans-serif" }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {p.name}
                    </span>
                    {isMe && (
                      <span className="ml-1.5 text-[10px] font-bold" style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}>
                        (You)
                      </span>
                    )}
                  </div>
                </div>
                {isRoomHost && (
                  <div className="deshi-badge-gold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Host
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Host: Duration Picker ── */}
      {isHost && (
        <div className="deshi-card w-full space-y-3">
          <div
            className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200 pb-3"
            style={{ borderBottom: "1px solid var(--glass-border)", fontFamily: "'Sora', sans-serif" }}
          >
            <Clock className="w-4 h-4" style={{ color: "var(--clr-blue)" }} />
            Round Duration
          </div>
          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleDuration(opt.value)}
                className="py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer"
                style={
                  currentDuration === opt.value
                    ? {
                        background: "linear-gradient(135deg, #0F4C81, #2563EB)",
                        color: "#fff",
                        boxShadow: "0 4px 14px rgba(15,76,129,0.3)",
                        border: "1px solid transparent",
                        fontFamily: "'Sora', sans-serif",
                      }
                    : {
                        background: "rgba(248,250,252,0.7)",
                        border: "1.5px solid rgba(226,232,240,0.8)",
                        color: "#475569",
                        fontFamily: "'Sora', sans-serif",
                      }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Start / Waiting ── */}
      {isHost ? (
        <button
          onClick={handleStart}
          disabled={players.length < 3}
          className={`w-full ${players.length < 3 ? "" : "deshi-btn-blue animate-pulse-glow shimmer-sweep"}`}
          style={
            players.length < 3
              ? {
                  background: "rgba(226,232,240,0.8)",
                  color: "#94a3b8",
                  cursor: "not-allowed",
                  padding: "1rem",
                  borderRadius: "16px",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  border: "1px solid rgba(203,213,225,0.5)",
                }
              : {}
          }
        >
          <Play className="w-5 h-5 fill-current" />
          {players.length < 3
            ? `Need ${3 - players.length} more player${3 - players.length > 1 ? "s" : ""}…`
            : "Start Game!"}
        </button>
      ) : (
        <div
          className="w-full text-center p-4 rounded-2xl"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--glass-shadow)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "linear-gradient(135deg, #0F4C81, #2563EB)" }}
            />
            <p
              className="text-sm font-bold text-slate-600 dark:text-slate-300"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Waiting for host to start…
            </p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {players.find((p) => p.id === roomData.hostId)?.name || "Host"} will start the game
          </p>
        </div>
      )}
    </div>
  );
}
