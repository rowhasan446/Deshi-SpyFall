"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldAlert, ArrowRight } from "lucide-react";
import { getSoundEngine } from "../lib/sounds";

export default function RoleRevealScreen({ roomData, currentPlayerId, onProceedToGame }) {
  const [isHolding, setIsHolding] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sfx = getSoundEngine();

  const player = roomData?.players?.[currentPlayerId];
  const isHost = roomData?.hostId === currentPlayerId;
  const isSpy = player?.isSpy;

  // Play reveal sound once per session
  useEffect(() => {
    if (isHolding && !revealed) {
      setRevealed(true);
      sfx.play(isSpy ? "spyReveal" : "reveal");
    }
  }, [isHolding, revealed, isSpy, sfx]);

  return (
    <div className="w-full flex flex-col items-center gap-5 py-4 animate-fadeIn">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Secret Card 🤫</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Press & hold to reveal. Keep it secret from others!</p>
      </div>

      {/* Hold-to-Reveal Card */}
      <div
        onMouseDown={() => setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
        onMouseLeave={() => setIsHolding(false)}
        onTouchStart={() => setIsHolding(true)}
        onTouchEnd={() => setIsHolding(false)}
        className="w-full cursor-pointer select-none touch-none"
      >
        <motion.div
          animate={{ scale: isHolding ? 1.025 : 1, boxShadow: isHolding ? "0 20px 50px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.06)" }}
          transition={{ duration: 0.18 }}
          className={`w-full min-h-[300px] rounded-3xl p-6 flex flex-col justify-between items-center text-center border-2 transition-colors ${
            isHolding
              ? isSpy
                ? "bg-red-50 dark:bg-red-950/60 border-deshi-red"
                : "bg-blue-50 dark:bg-blue-950/60 border-deshi-blue dark:border-blue-400"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="w-full flex justify-between items-center text-[11px] font-extrabold uppercase tracking-widest">
            <span className={isHolding ? (isSpy ? "text-deshi-red" : "text-deshi-blue dark:text-blue-400") : "text-slate-400 dark:text-slate-500"}>
              {isHolding ? "🔓 Revealed" : "🔒 Hidden"}
            </span>
            {isHolding
              ? <EyeOff className={`w-4 h-4 ${isSpy ? "text-deshi-red" : "text-deshi-blue dark:text-blue-400"}`} />
              : <Eye className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
          </div>

          {isHolding ? (
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }} className="space-y-4 py-4 flex-1 flex flex-col items-center justify-center">
              {isSpy ? (
                <>
                  <div className="text-6xl animate-bounce">🕵️‍♂️</div>
                  <h3 className="text-3xl font-black text-deshi-red">You are the Spy!</h3>
                  <p className="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 p-3.5 rounded-2xl font-semibold leading-relaxed max-w-xs">
                    You don't know the location. Blend in, answer carefully, and try to guess the location to win!
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl">{roomData?.location?.emoji || "📍"}</div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-deshi-blue dark:text-blue-400 font-extrabold mb-1">Location</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{roomData?.location?.name}</h3>
                  </div>
                  <div className="pt-3 border-t border-blue-100 dark:border-slate-800 w-full">
                    <p className="text-[11px] uppercase tracking-widest text-deshi-red font-extrabold mb-1">Your Role</p>
                    <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{player?.role}</h4>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3 py-10 flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-base font-extrabold text-slate-700 dark:text-slate-300">Press & Hold to Reveal</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Make sure nobody is looking at your screen!</p>
            </div>
          )}

          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {isHolding ? "Release to hide" : "Touch & hold"}
          </div>
        </motion.div>
      </div>

      {isHost ? (
        <button onClick={() => { sfx.play("start"); onProceedToGame(); }} className="deshi-btn-blue w-full">
          Everyone seen their role? Start Round! <ArrowRight className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-full text-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
            Waiting for host to start the round…
          </p>
        </div>
      )}
    </div>
  );
}
