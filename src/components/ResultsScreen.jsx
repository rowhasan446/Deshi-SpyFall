"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, RotateCcw, MapPin, User } from "lucide-react";

export default function ResultsScreen({
  roomData,
  currentPlayerId,
  onPlayAgain,
}) {
  const isHost = roomData?.hostId === currentPlayerId;
  const players = roomData?.players ? Object.values(roomData.players) : [];
  const spy = players.find((p) => p.isSpy || p.id === roomData?.spyId);
  const isWinnerSpy = roomData?.winner === "spy";

  useEffect(() => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.5 },
      colors: isWinnerSpy
        ? ["#DC2626", "#991B1B", "#FCA5A5", "#f97316"]
        : ["#0F4C81", "#2563EB", "#93C5FD", "#006A4E"],
    });
  }, [isWinnerSpy]);

  const avatarColors = [
    "linear-gradient(135deg, #0F4C81, #2563EB)",
    "linear-gradient(135deg, #006A4E, #059669)",
    "linear-gradient(135deg, #7c3aed, #a78bfa)",
    "linear-gradient(135deg, #c2410c, #f97316)",
    "linear-gradient(135deg, #0e7490, #06b6d4)",
    "linear-gradient(135deg, #be185d, #ec4899)",
  ];

  return (
    <div className="w-full flex flex-col items-center gap-5 py-4 animate-fadeIn">

      {/* ── Winner Banner ── */}
      <div
        className="w-full rounded-3xl p-6 text-center space-y-3 relative overflow-hidden"
        style={{
          background: isWinnerSpy
            ? "linear-gradient(135deg, rgba(254,242,242,0.98) 0%, rgba(254,215,215,0.92) 100%)"
            : "linear-gradient(135deg, rgba(239,246,255,0.98) 0%, rgba(219,234,254,0.92) 100%)",
          border: `2px solid ${isWinnerSpy ? "rgba(220,38,38,0.3)" : "rgba(15,76,129,0.25)"}`,
          boxShadow: isWinnerSpy
            ? "0 8px 40px rgba(220,38,38,0.15)"
            : "0 8px 40px rgba(15,76,129,0.12)",
        }}
      >
        {/* Top gradient stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: isWinnerSpy
              ? "linear-gradient(90deg, #7f1d1d, #DC2626, #ef4444, #DC2626, #7f1d1d)"
              : "linear-gradient(90deg, #0F4C81, #2563EB, #3b82f6, #2563EB, #0F4C81)",
          }}
        />

        {/* Trophy icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto"
          style={{
            background: isWinnerSpy
              ? "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(220,38,38,0.08))"
              : "linear-gradient(135deg, rgba(15,76,129,0.15), rgba(15,76,129,0.08))",
            border: `1.5px solid ${isWinnerSpy ? "rgba(220,38,38,0.25)" : "rgba(15,76,129,0.2)"}`,
          }}
        >
          <Trophy
            className="w-8 h-8"
            style={{ color: isWinnerSpy ? "var(--clr-red)" : "var(--clr-blue)" }}
          />
        </div>

        <div>
          <h2
            className="text-3xl font-black"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: isWinnerSpy
                ? "linear-gradient(135deg, #b91c1c, #DC2626)"
                : "linear-gradient(135deg, #0F4C81, #2563EB)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {isWinnerSpy ? "The Spy Wins! 🕵️‍♂️" : "Citizens Win! 🎉"}
          </h2>
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: isWinnerSpy ? "#b91c1c" : "#0F4C81" }}
          >
            {isWinnerSpy
              ? "The Spy successfully blended in or guessed the location!"
              : "The citizens caught the Spy red-handed!"}
          </p>
        </div>
      </div>

      {/* ── Round Summary Card ── */}
      <div className="deshi-card w-full space-y-3">
        <h3
          className="text-[10px] uppercase tracking-widest font-bold pb-3"
          style={{
            color: "var(--clr-blue)",
            fontFamily: "'Sora', sans-serif",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          Round Summary
        </h3>

        {/* Location */}
        <div
          className="flex items-center justify-between p-3.5 rounded-2xl"
          style={{
            background: "rgba(239,246,255,0.8)",
            border: "1px solid rgba(15,76,129,0.12)",
          }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" style={{ color: "var(--clr-blue)" }} />
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}
            >
              Location
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{roomData?.location?.emoji}</span>
            <span
              className="text-base font-extrabold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {roomData?.location?.name}
            </span>
          </div>
        </div>

        {/* Spy identity */}
        <div
          className="flex items-center justify-between p-3.5 rounded-2xl"
          style={{
            background: "rgba(254,242,242,0.8)",
            border: "1px solid rgba(220,38,38,0.14)",
          }}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: "var(--clr-red)" }} />
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--clr-red)", fontFamily: "'Sora', sans-serif" }}
            >
              The Spy Was
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🕵️</span>
            <span
              className="text-base font-extrabold"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #b91c1c, #DC2626)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {spy?.name || "Unknown"}
            </span>
          </div>
        </div>

        {/* Spy guess note */}
        {roomData?.spyGuess && (
          <div
            className="p-3.5 rounded-2xl space-y-1"
            style={{
              background: roomData.spyGuess === roomData?.location?.name
                ? "rgba(255,251,235,0.9)"
                : "rgba(248,250,252,0.8)",
              border: `1px solid ${roomData.spyGuess === roomData?.location?.name
                ? "rgba(217,119,6,0.2)"
                : "rgba(226,232,240,0.7)"
              }`,
            }}
          >
            <p
              className="font-bold text-slate-800 dark:text-slate-200 text-sm"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Spy Guessed:{" "}
              <span style={{ color: "var(--clr-blue)" }}>{roomData.spyGuess}</span>
            </p>
            <p
              className="text-xs font-semibold"
              style={{
                color: roomData.spyGuess === roomData?.location?.name
                  ? "#92400e"
                  : "#64748b",
              }}
            >
              {roomData.spyGuess === roomData?.location?.name
                ? "✅ Correct — Spy wins instantly!"
                : "❌ Wrong guess — Citizens win!"}
            </p>
          </div>
        )}
      </div>

      {/* ── Player Roles Breakdown ── */}
      <div className="deshi-card w-full space-y-3">
        <h3
          className="text-[10px] uppercase tracking-widest font-bold pb-3"
          style={{
            color: "var(--clr-blue)",
            fontFamily: "'Sora', sans-serif",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          All Players & Roles
        </h3>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: p.isSpy ? "rgba(254,242,242,0.8)" : "rgba(248,250,252,0.7)",
                border: `1px solid ${p.isSpy ? "rgba(220,38,38,0.15)" : "rgba(226,232,240,0.6)"}`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="deshi-avatar w-8 h-8 rounded-lg text-xs"
                  style={{
                    background: p.isSpy
                      ? "linear-gradient(135deg, #b91c1c, #DC2626)"
                      : avatarColors[idx % avatarColors.length],
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className="font-bold text-slate-800 dark:text-slate-200 text-sm"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {p.name}
                  {p.id === currentPlayerId && (
                    <span className="ml-1 text-xs font-bold" style={{ color: "var(--clr-blue)" }}>(You)</span>
                  )}
                </span>
              </div>
              <span
                className="text-xs font-extrabold"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  color: p.isSpy ? "var(--clr-red)" : "#475569",
                }}
              >
                {p.isSpy ? "Spy 🕵️" : p.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Play Again ── */}
      {isHost ? (
        <button onClick={onPlayAgain} className="deshi-btn-blue shimmer-sweep w-full">
          <RotateCcw className="w-5 h-5" />
          Play Again!
        </button>
      ) : (
        <div
          className="w-full text-center p-4 rounded-2xl"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--clr-blue)" }} />
            <p
              className="text-xs font-semibold text-slate-600 dark:text-slate-400"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Waiting for {players.find((p) => p.id === roomData?.hostId)?.name || "Host"} to start a new round...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
