"use client";

import { useState, useEffect, useRef } from "react";
import { Vote, CheckCircle, MapPin, Clock, Target } from "lucide-react";
import { LOCATIONS } from "../data/locations";
import { getSoundEngine } from "../lib/sounds";

export default function VotingScreen({
  roomData,
  currentPlayerId,
  onCastVote,
  onSpyGuessLocation,
}) {
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [selectedLocationGuess, setSelectedLocationGuess] = useState("");
  const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(roomData?.roundDuration || 480);
  const sfx = getSoundEngine();

  const player = roomData?.players?.[currentPlayerId];
  const isSpy = player?.isSpy;
  const hasVoted = player?.hasVoted;

  const players = roomData?.players ? Object.values(roomData.players) : [];
  const totalPlayers = players.length;
  const votedPlayersCount = players.filter((p) => p.hasVoted).length;

  const caughtSpyId = roomData?.caughtSpyId;
  const isSpyCaught = !!caughtSpyId;
  const iCaughtSpy = currentPlayerId === caughtSpyId;

  useEffect(() => {
    const startTimeNum = typeof roomData?.startTime === "number" ? roomData.startTime : Date.now();
    const durationSec = roomData?.roundDuration || 480;
    const calcTime = () => Math.max(0, durationSec - Math.floor((Date.now() - startTimeNum) / 1000));
    setTimeLeft(calcTime());
    const interval = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(interval);
  }, [roomData?.startTime, roomData?.roundDuration]);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const critical = timeLeft <= 60;

  const handleInputFocus = (e) => {
    const target = e.target;
    setTimeout(() => { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150);
    setTimeout(() => { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 450);
  };

  const handleVoteSubmit = () => {
    if (!selectedTargetId) return;
    sfx.play("voteSubmit");
    onCastVote(selectedTargetId);
  };

  const handleSpyGuessSubmit = () => {
    if (!selectedLocationGuess || isSubmittingGuess) return;
    setIsSubmittingGuess(true);
    sfx.play("reveal");
    onSpyGuessLocation(selectedLocationGuess);
  };

  const avatarColors = [
    "linear-gradient(135deg, #0F4C81, #2563EB)",
    "linear-gradient(135deg, #006A4E, #059669)",
    "linear-gradient(135deg, #7c3aed, #a78bfa)",
    "linear-gradient(135deg, #c2410c, #f97316)",
    "linear-gradient(135deg, #0e7490, #06b6d4)",
    "linear-gradient(135deg, #be185d, #ec4899)",
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 animate-fadeIn">

      {/* ── Timer Bar ── */}
      <div
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl"
        style={{
          background: critical ? "rgba(254,242,242,0.9)" : "var(--glass-bg)",
          border: `1px solid ${critical ? "rgba(220,38,38,0.2)" : "var(--glass-border)"}`,
          boxShadow: "var(--glass-shadow)",
        }}
      >
        <div className="flex items-center gap-2">
          <Clock
            className="w-4 h-4"
            style={{ color: critical ? "var(--clr-red)" : "var(--clr-blue)" }}
          />
          <span
            className="text-xs font-bold text-slate-700 dark:text-slate-300"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Round Time Remaining
          </span>
        </div>
        <span
          className={`font-black text-lg tabular-nums ${critical ? "animate-pulse" : ""}`}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: critical ? "var(--clr-red)" : "var(--clr-blue)",
          }}
        >
          {fmt(timeLeft)}
        </span>
      </div>

      {/* ── Vote Banner Header ── */}
      <div
        className="w-full rounded-3xl p-5 text-center space-y-2 relative overflow-hidden"
        style={{
          background: isSpyCaught
            ? "linear-gradient(135deg, rgba(254,242,242,0.95), rgba(254,226,226,0.85))"
            : "linear-gradient(135deg, rgba(254,242,242,0.95), rgba(254,226,226,0.85))",
          border: "1.5px solid rgba(220,38,38,0.22)",
          boxShadow: "0 4px 24px rgba(220,38,38,0.1)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, #b91c1c, #DC2626, #ef4444)" }}
        />
        <div
          className="inline-flex items-center justify-center p-3 rounded-2xl mb-1"
          style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.2)",
          }}
        >
          <Vote className="w-6 h-6" style={{ color: "var(--clr-red)" }} />
        </div>
        <h2
          className="text-xl font-black text-slate-900 dark:text-white"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {isSpyCaught ? "Spy Caught! Final Choice 🎯" : "Who is the Spy? Vote Now!"}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {isSpyCaught
            ? "The Spy has exactly ONE chance to guess the location to win!"
            : "Select who you suspect. Votes sync in real time."}
        </p>
        {!isSpyCaught && (
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-xs font-bold" style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}>
              Votes: {votedPlayersCount} / {totalPlayers}
            </div>
            {/* Progress bar */}
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(220,38,38,0.1)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(votedPlayersCount / totalPlayers) * 100}%`,
                  background: "linear-gradient(90deg, #b91c1c, #DC2626)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Spy caught: location guess ── */}
      {isSpyCaught && (
        <div className="deshi-card w-full space-y-4">
          {iCaughtSpy ? (
            <>
              <div
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: "var(--clr-red)", fontFamily: "'Sora', sans-serif" }}
              >
                <MapPin className="w-4 h-4" />
                You were caught! Guess the Location to win
              </div>
              <p className="text-xs text-slate-500 font-medium">
                You can select a location ONLY ONCE. If correct, you steal the win!
              </p>
              <select
                value={selectedLocationGuess}
                disabled={isSubmittingGuess}
                onChange={(e) => setSelectedLocationGuess(e.target.value)}
                onFocus={handleInputFocus}
                className="deshi-input deshi-input-red"
              >
                <option value="">-- Select Location --</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.emoji} {loc.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSpyGuessSubmit}
                disabled={!selectedLocationGuess || isSubmittingGuess}
                className={`w-full ${!selectedLocationGuess || isSubmittingGuess ? "" : "deshi-btn-blue shimmer-sweep"}`}
                style={
                  !selectedLocationGuess || isSubmittingGuess
                    ? {
                        background: "rgba(226,232,240,0.8)",
                        color: "#94a3b8",
                        padding: "0.875rem",
                        borderRadius: "14px",
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "not-allowed",
                        border: "1px solid rgba(203,213,225,0.5)",
                      }
                    : {}
                }
              >
                {isSubmittingGuess ? "Submitting…" : "Submit Location Guess 🎯"}
              </button>
            </>
          ) : (
            <div
              className="text-center p-5 space-y-2 rounded-2xl"
              style={{
                background: "rgba(255,251,235,0.9)",
                border: "1px solid rgba(217,119,6,0.2)",
              }}
            >
              <div className="text-3xl">🕵️‍♂️</div>
              <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                The Spy was caught!
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--clr-gold)" }} />
                <p className="text-xs text-slate-600 font-semibold">
                  Waiting for the Spy to make their final location guess…
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Regular voting ── */}
      {!isSpyCaught && (
        <div className="deshi-card w-full space-y-3">
          {/* Spy early guess */}
          {isSpy && !hasVoted && (
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{
                background: "rgba(239,246,255,0.8)",
                border: "1px solid rgba(15,76,129,0.15)",
              }}
            >
              <div
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}
              >
                <Target className="w-4 h-4" />
                Spy Option: Guess the Location now
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Guess the location directly and win! You can choose ONLY ONCE.
              </p>
              <select
                value={selectedLocationGuess}
                disabled={isSubmittingGuess}
                onChange={(e) => setSelectedLocationGuess(e.target.value)}
                onFocus={handleInputFocus}
                className="deshi-input"
              >
                <option value="">-- Select Location --</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.emoji} {loc.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSpyGuessSubmit}
                disabled={!selectedLocationGuess || isSubmittingGuess}
                className={`w-full text-sm ${!selectedLocationGuess || isSubmittingGuess ? "" : "deshi-btn-blue shimmer-sweep"}`}
                style={
                  !selectedLocationGuess || isSubmittingGuess
                    ? {
                        background: "rgba(226,232,240,0.8)",
                        color: "#94a3b8",
                        padding: "0.875rem",
                        borderRadius: "14px",
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 700,
                        cursor: "not-allowed",
                        border: "1px solid rgba(203,213,225,0.5)",
                      }
                    : {}
                }
              >
                {isSubmittingGuess ? "Submitting…" : "Submit Location Guess 🎯"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 deshi-divider" />
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  or vote below
                </span>
                <div className="flex-1 deshi-divider" />
              </div>
            </div>
          )}

          <p
            className="text-[10px] uppercase tracking-widest font-bold"
            style={{ color: "#94a3b8", fontFamily: "'Sora', sans-serif" }}
          >
            Select Suspect:
          </p>

          {hasVoted ? (
            <div
              className="text-center p-6 space-y-2 rounded-2xl"
              style={{
                background: "rgba(239,246,255,0.8)",
                border: "1px solid rgba(15,76,129,0.15)",
              }}
            >
              <CheckCircle className="w-10 h-10 mx-auto" style={{ color: "var(--clr-blue)" }} />
              <p className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                Your Vote Has Been Submitted!
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--clr-blue)" }} />
                <p className="text-xs text-slate-500 font-semibold">
                  Waiting for {totalPlayers - votedPlayersCount} more player{totalPlayers - votedPlayersCount !== 1 ? "s" : ""}…
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((p, idx) => {
                const isMe = p.id === currentPlayerId;
                const isSelected = selectedTargetId === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={isMe}
                    onClick={() => { sfx.play("click"); setSelectedTargetId(p.id); }}
                    className="w-full flex items-center justify-between transition-all cursor-pointer"
                    style={{
                      padding: "0.875rem 1rem",
                      borderRadius: "16px",
                      border: isSelected
                        ? "2px solid rgba(220,38,38,0.45)"
                        : isMe
                        ? "1px solid rgba(226,232,240,0.5)"
                        : "1px solid rgba(226,232,240,0.7)",
                      background: isSelected
                        ? "rgba(254,242,242,0.95)"
                        : isMe
                        ? "rgba(248,250,252,0.4)"
                        : "rgba(248,250,252,0.7)",
                      opacity: isMe ? 0.5 : 1,
                      cursor: isMe ? "not-allowed" : "pointer",
                      boxShadow: isSelected ? "0 4px 16px rgba(220,38,38,0.12)" : "none",
                      transform: isSelected ? "scale(1.01)" : "scale(1)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="deshi-avatar w-9 h-9 rounded-xl text-sm"
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, #b91c1c, #DC2626)"
                            : avatarColors[idx % avatarColors.length],
                          fontFamily: "'Sora', sans-serif",
                        }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {p.name} {isMe && <span className="text-xs text-slate-400">(You)</span>}
                      </span>
                    </div>
                    {isSelected && <Vote className="w-5 h-5" style={{ color: "var(--clr-red)" }} />}
                  </button>
                );
              })}

              <button
                onClick={handleVoteSubmit}
                disabled={!selectedTargetId}
                className={`w-full mt-2 ${!selectedTargetId ? "" : "deshi-btn-red shimmer-sweep"}`}
                style={
                  !selectedTargetId
                    ? {
                        background: "rgba(226,232,240,0.8)",
                        color: "#94a3b8",
                        padding: "1rem",
                        borderRadius: "14px",
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "not-allowed",
                        border: "1px solid rgba(203,213,225,0.5)",
                      }
                    : {}
                }
              >
                Confirm Vote 🗳️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
