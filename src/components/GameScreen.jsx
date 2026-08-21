"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Vote, Eye, EyeOff, ChevronDown, ChevronUp, Swords } from "lucide-react";
import { LOCATIONS } from "../data/locations";
import { getSoundEngine } from "../lib/sounds";

export default function GameScreen({ roomData, currentPlayerId, onCallVote, onEndRound }) {
  const [showLocationsList, setShowLocationsList] = useState(false);
  const [showMyRole, setShowMyRole] = useState(false);
  const [timeLeft, setTimeLeft] = useState(roomData?.roundDuration || 480);
  const beepedRef = useRef(false);
  const sfx = getSoundEngine();

  const player = roomData?.players?.[currentPlayerId];
  const isHost = roomData?.hostId === currentPlayerId;
  const players = roomData?.players ? Object.values(roomData.players) : [];

  useEffect(() => {
    const startTimeNum = typeof roomData?.startTime === "number" ? roomData.startTime : Date.now();
    const durationSec = roomData?.roundDuration || 480;

    const calcTime = () => {
      const elapsed = Math.floor((Date.now() - startTimeNum) / 1000);
      return Math.max(0, durationSec - elapsed);
    };

    setTimeLeft(calcTime());
    const interval = setInterval(() => {
      const remaining = calcTime();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (isHost && roomData?.status === "playing") onCallVote();
      } else {
        if ((remaining === 60 || remaining === 10) && !beepedRef.current) {
          sfx.play("countdown");
          beepedRef.current = true;
          setTimeout(() => { beepedRef.current = false; }, 2000);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomData?.startTime, roomData?.roundDuration, roomData?.status, isHost, onCallVote, sfx]);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const critical = timeLeft <= 60;
  const pct = roomData?.roundDuration ? (timeLeft / roomData.roundDuration) * 100 : 100;

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

      {/* ── Timer Card ── */}
      <div
        className="w-full rounded-3xl p-5 text-center space-y-3 relative overflow-hidden"
        style={{
          background: critical
            ? "linear-gradient(135deg, rgba(254,242,242,0.95), rgba(254,226,226,0.85))"
            : "linear-gradient(135deg, rgba(239,246,255,0.95), rgba(219,234,254,0.85))",
          border: `1.5px solid ${critical ? "rgba(220,38,38,0.25)" : "rgba(15,76,129,0.18)"}`,
          boxShadow: critical
            ? "0 4px 24px rgba(220,38,38,0.1)"
            : "0 4px 24px rgba(15,76,129,0.08)",
        }}
      >
        {/* Top accent stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: critical
              ? "linear-gradient(90deg, #b91c1c, #DC2626, #ef4444)"
              : "linear-gradient(90deg, #0F4C81, #2563EB, #3b82f6)",
          }}
        />

        <div className="flex items-center justify-center gap-2">
          <Clock
            className="w-4 h-4"
            style={{ color: critical ? "var(--clr-red)" : "var(--clr-blue)" }}
          />
          <span
            className="text-[10px] uppercase tracking-widest font-bold"
            style={{
              color: critical ? "var(--clr-red)" : "var(--clr-blue)",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Time Remaining
          </span>
        </div>

        <div
          className={`text-6xl font-black tabular-nums tracking-wide ${critical ? "animate-countdown" : ""}`}
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            color: critical ? "var(--clr-red)" : "var(--clr-blue)",
          }}
        >
          {fmt(timeLeft)}
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: critical ? "rgba(220,38,38,0.12)" : "rgba(15,76,129,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: critical
                ? "linear-gradient(90deg, #b91c1c, #DC2626)"
                : "linear-gradient(90deg, #0F4C81, #2563EB)",
            }}
          />
        </div>
      </div>

      {/* ── My Role Peek ── */}
      <div
        className="w-full rounded-2xl p-3.5 flex items-center justify-between"
        style={{
          background: showMyRole
            ? player?.isSpy
              ? "rgba(254,242,242,0.9)"
              : "rgba(239,246,255,0.9)"
            : "var(--glass-bg)",
          border: `1px solid ${showMyRole
            ? player?.isSpy ? "rgba(220,38,38,0.2)" : "rgba(15,76,129,0.18)"
            : "var(--glass-border)"
          }`,
          boxShadow: "var(--glass-shadow)",
          transition: "all 0.2s ease",
        }}
      >
        <div className="flex-1 min-w-0 pr-2">
          <p
            className="text-[10px] uppercase tracking-widest font-bold mb-0.5"
            style={{
              color: showMyRole
                ? player?.isSpy ? "var(--clr-red)" : "var(--clr-blue)"
                : "var(--clr-blue)",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Your Secret Role
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {showMyRole
              ? player?.isSpy
                ? "You are the Spy! 🕵️"
                : `${player?.role} @ ${roomData?.location?.name}`
              : "•••••••••"}
          </p>
        </div>
        <button
          onClick={() => { sfx.play("click"); setShowMyRole(!showMyRole); }}
          className="p-2 rounded-xl transition-all cursor-pointer shrink-0"
          style={{
            background: showMyRole ? "rgba(15,76,129,0.08)" : "rgba(226,232,240,0.5)",
            border: `1px solid ${showMyRole ? "rgba(15,76,129,0.15)" : "rgba(203,213,225,0.5)"}`,
          }}
        >
          {showMyRole
            ? <EyeOff className="w-4 h-4" style={{ color: "var(--clr-blue)" }} />
            : <Eye className="w-4 h-4 text-slate-500" />
          }
        </button>
      </div>

      {/* ── Call Vote Button ── */}
      <button
        onClick={() => { sfx.play("vote"); onCallVote(); }}
        className="deshi-btn-red shimmer-sweep animate-pulse-glow-red w-full"
      >
        <Swords className="w-5 h-5" />
        Call Vote — Find the Spy!
      </button>

      {/* ── Locations List ── */}
      <div className="deshi-card w-full p-4 space-y-2">
        <button
          onClick={() => { sfx.play("click"); setShowLocationsList(!showLocationsList); }}
          className="w-full flex items-center justify-between cursor-pointer group"
        >
          <span
            className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            📍 Possible Locations
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(15,76,129,0.08)", color: "var(--clr-blue)" }}
            >
              {LOCATIONS.length}
            </span>
          </span>
          {showLocationsList
            ? <ChevronUp className="w-4 h-4 text-deshi-blue" />
            : <ChevronDown className="w-4 h-4 text-deshi-blue" />
          }
        </button>

        {showLocationsList && (
          <div
            className="pt-3 grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto"
            style={{ borderTop: "1px solid var(--glass-border)" }}
          >
            {LOCATIONS.map((loc) => (
              <div
                key={loc.name}
                className="flex items-center gap-2 p-2.5 rounded-xl transition-all"
                style={{
                  background: "rgba(248,250,252,0.7)",
                  border: "1px solid rgba(226,232,240,0.6)",
                }}
              >
                <span className="text-base shrink-0">{loc.emoji}</span>
                <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {loc.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Players Grid ── */}
      <div className="deshi-card w-full p-4 space-y-3">
        <p
          className="text-[10px] uppercase tracking-widest font-bold"
          style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}
        >
          Players in Game
        </p>
        <div className="grid grid-cols-2 gap-2">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className="flex items-center gap-2.5 p-2.5 rounded-xl"
              style={{
                background: p.id === currentPlayerId ? "rgba(15,76,129,0.06)" : "rgba(248,250,252,0.7)",
                border: `1px solid ${p.id === currentPlayerId ? "rgba(15,76,129,0.14)" : "rgba(226,232,240,0.6)"}`,
              }}
            >
              <div
                className="deshi-avatar w-7 h-7 rounded-lg text-xs shrink-0"
                style={{ background: avatarColors[idx % avatarColors.length], fontFamily: "'Sora', sans-serif" }}
              >
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {p.name}
                {p.id === currentPlayerId && (
                  <span className="ml-1 font-bold" style={{ color: "var(--clr-blue)" }}>(You)</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isHost && (
        <button
          onClick={() => { sfx.play("back"); onEndRound(); }}
          className="text-xs font-bold cursor-pointer transition-all hover:opacity-80"
          style={{ color: "var(--clr-red)", textDecoration: "underline", fontFamily: "'Sora', sans-serif" }}
        >
          Host: End round early
        </button>
      )}
    </div>
  );
}
