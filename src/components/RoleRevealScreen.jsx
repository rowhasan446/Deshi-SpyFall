"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldAlert, ArrowRight, Lock, Unlock } from "lucide-react";
import { getSoundEngine } from "../lib/sounds";

export default function RoleRevealScreen({ roomData, currentPlayerId, onProceedToGame }) {
  const [isHolding, setIsHolding] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sfx = getSoundEngine();

  const player = roomData?.players?.[currentPlayerId];
  const isHost = roomData?.hostId === currentPlayerId;
  const isSpy = player?.isSpy;

  useEffect(() => {
    if (isHolding && !revealed) {
      setRevealed(true);
      sfx.play(isSpy ? "spyReveal" : "reveal");
    }
  }, [isHolding, revealed, isSpy, sfx]);

  return (
    <div className="w-full flex flex-col items-center gap-5 py-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2
          className="text-2xl font-black text-slate-900 dark:text-white"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Your Secret Card 🤫
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Press & hold to reveal. Keep it secret from others!
        </p>
      </div>

      {/* ── Hold-to-Reveal Card ── */}
      <div
        onMouseDown={() => setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
        onMouseLeave={() => setIsHolding(false)}
        onTouchStart={() => setIsHolding(true)}
        onTouchEnd={() => setIsHolding(false)}
        className="w-full cursor-pointer select-none touch-none"
      >
        <motion.div
          animate={{
            scale: isHolding ? 1.02 : 1,
            boxShadow: isHolding
              ? isSpy
                ? "0 24px 60px rgba(220,38,38,0.25), 0 8px 24px rgba(220,38,38,0.15)"
                : "0 24px 60px rgba(15,76,129,0.2), 0 8px 24px rgba(15,76,129,0.12)"
              : "0 4px 20px rgba(0,0,0,0.06)",
          }}
          transition={{ duration: 0.2 }}
          className="w-full min-h-[300px] rounded-3xl p-6 flex flex-col justify-between items-center text-center overflow-hidden relative"
          style={{
            background: isHolding
              ? isSpy
                ? "linear-gradient(135deg, rgba(254,242,242,1) 0%, rgba(254,226,226,0.8) 100%)"
                : "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(219,234,254,0.8) 100%)"
              : "var(--glass-bg)",
            border: isHolding
              ? `2px solid ${isSpy ? "rgba(220,38,38,0.4)" : "rgba(15,76,129,0.35)"}`
              : "1.5px solid var(--glass-border)",
          }}
        >
          {/* Top stripe accent */}
          {isHolding && (
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: isSpy
                  ? "linear-gradient(90deg, #b91c1c, #DC2626, #ef4444)"
                  : "linear-gradient(90deg, #0F4C81, #2563EB, #3b82f6)",
              }}
            />
          )}

          {/* Status pill */}
          <div className="w-full flex justify-between items-center">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
              style={{
                background: isHolding
                  ? isSpy ? "rgba(220,38,38,0.12)" : "rgba(15,76,129,0.1)"
                  : "rgba(226,232,240,0.6)",
                border: `1px solid ${isHolding ? (isSpy ? "rgba(220,38,38,0.25)" : "rgba(15,76,129,0.2)") : "rgba(203,213,225,0.5)"}`,
                color: isHolding
                  ? isSpy ? "#b91c1c" : "#0F4C81"
                  : "#94a3b8",
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {isHolding
                ? <><Unlock className="w-3 h-3" /> Revealed</>
                : <><Lock className="w-3 h-3" /> Hidden</>
              }
            </div>
            {isHolding
              ? <EyeOff className="w-4 h-4" style={{ color: isSpy ? "#b91c1c" : "#0F4C81" }} />
              : <Eye className="w-4 h-4 text-slate-400" />
            }
          </div>

          {/* Content */}
          {isHolding ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22 }}
              className="space-y-4 py-4 flex-1 flex flex-col items-center justify-center"
            >
              {isSpy ? (
                <>
                  <div className="text-6xl animate-bounce">🕵️‍♂️</div>
                  <div>
                    <h3
                      className="text-3xl font-black"
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        background: "linear-gradient(135deg, #b91c1c, #DC2626)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      You are the Spy!
                    </h3>
                  </div>
                  <div
                    className="text-xs font-semibold leading-relaxed max-w-xs p-4 rounded-2xl"
                    style={{
                      background: "rgba(220,38,38,0.08)",
                      border: "1px solid rgba(220,38,38,0.18)",
                      color: "#991b1b",
                    }}
                  >
                    You don't know the location. Blend in, answer carefully, and try to guess the location to win!
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl animate-popIn">{roomData?.location?.emoji || "📍"}</div>
                  <div className="space-y-1">
                    <p
                      className="text-[10px] uppercase tracking-widest font-bold"
                      style={{ color: "var(--clr-blue)", fontFamily: "'Sora', sans-serif" }}
                    >
                      Location
                    </p>
                    <h3
                      className="text-2xl font-black text-slate-900 dark:text-white"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {roomData?.location?.name}
                    </h3>
                  </div>
                  <div
                    className="pt-3 w-full"
                    style={{ borderTop: "1px solid rgba(15,76,129,0.12)" }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-widest font-bold mb-1"
                      style={{ color: "var(--clr-red)", fontFamily: "'Sora', sans-serif" }}
                    >
                      Your Role
                    </p>
                    <h4
                      className="text-xl font-extrabold text-slate-800 dark:text-slate-200"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {player?.role}
                    </h4>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3 py-10 flex-1 flex flex-col items-center justify-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(226,232,240,0.6)",
                  border: "1.5px solid rgba(203,213,225,0.5)",
                }}
              >
                <ShieldAlert className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p
                className="text-base font-bold text-slate-700 dark:text-slate-300"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Press & Hold to Reveal
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Make sure nobody is looking at your screen!
              </p>
            </div>
          )}

          {/* Footer hint */}
          <p
            className="text-[11px] font-semibold"
            style={{ color: isHolding ? (isSpy ? "#b91c1c" : "#0F4C81") : "#94a3b8", fontFamily: "'Sora', sans-serif" }}
          >
            {isHolding ? "Release to hide" : "Touch & hold"}
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      {isHost ? (
        <button
          onClick={() => { sfx.play("start"); onProceedToGame(); }}
          className="deshi-btn-blue shimmer-sweep w-full"
        >
          Everyone seen their role? Start Round!
          <ArrowRight className="w-5 h-5" />
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
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--clr-blue)" }} />
            <p
              className="text-sm font-semibold text-slate-600 dark:text-slate-400"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Waiting for host to start the round…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
