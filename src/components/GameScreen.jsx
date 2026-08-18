"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Vote, Eye, ChevronDown, ChevronUp } from "lucide-react";
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

  // Bulletproof timer logic
  useEffect(() => {
    // If roomData.startTime is a timestamp number use it, otherwise fallback to Date.now()
    const startTimeNum = typeof roomData?.startTime === "number" ? roomData.startTime : Date.now();
    const durationSec = roomData?.roundDuration || 480;

    const calcTime = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeNum) / 1000);
      return Math.max(0, durationSec - elapsed);
    };

    // Initial sync
    setTimeLeft(calcTime());

    const interval = setInterval(() => {
      const remaining = calcTime();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (isHost && roomData?.status === "playing") {
          onCallVote();
        }
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

  return (
    <div className="w-full flex flex-col items-center gap-4 py-3 animate-fadeIn">
      {/* Timer Card */}
      <div className="deshi-card w-full text-center space-y-2 py-5 border-blue-100 dark:border-slate-800">
        <div className="flex items-center justify-center gap-2">
          <Clock className={`w-4 h-4 ${critical ? "text-deshi-red" : "text-deshi-blue dark:text-blue-400"}`} />
          <span className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-extrabold">Time Remaining</span>
        </div>
        <div className={`text-6xl font-black font-mono tracking-wide transition-colors ${critical ? "text-deshi-red animate-countdown" : "text-slate-900 dark:text-white"}`}>
          {fmt(timeLeft)}
        </div>
        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${critical ? "bg-deshi-red" : "bg-deshi-blue dark:bg-blue-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* My Role Peek */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[11px] text-deshi-blue dark:text-blue-400 font-extrabold uppercase tracking-wide mb-0.5">Your Secret Role</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {showMyRole ? (player?.isSpy ? "You are the Spy! 🕵️" : `${player?.role} @ ${roomData?.location?.name}`) : "•••••••••"}
          </p>
        </div>
        <button onClick={() => { sfx.play("click"); setShowMyRole(!showMyRole); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-deshi-blue dark:hover:text-blue-400 transition-colors shrink-0 cursor-pointer">
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Call Vote */}
      <button onClick={() => { sfx.play("vote"); onCallVote(); }} className="deshi-btn-red w-full">
        <Vote className="w-5 h-5" /> Call Vote — Find the Spy!
      </button>

      {/* Locations list */}
      <div className="deshi-card w-full p-4 space-y-2">
        <button onClick={() => { sfx.play("click"); setShowLocationsList(!showLocationsList); }} className="w-full flex items-center justify-between text-sm font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer">
          <span>📍 Possible Locations ({LOCATIONS.length})</span>
          {showLocationsList ? <ChevronUp className="w-4 h-4 text-deshi-blue dark:text-blue-400" /> : <ChevronDown className="w-4 h-4 text-deshi-blue dark:text-blue-400" />}
        </button>
        {showLocationsList && (
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-44 overflow-y-auto">
            {LOCATIONS.map((loc) => (
              <div key={loc.name} className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60">
                <span>{loc.emoji}</span>
                <span className="truncate text-slate-700 dark:text-slate-300 font-semibold">{loc.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Players grid */}
      <div className="deshi-card w-full p-4 space-y-3">
        <p className="text-[11px] uppercase tracking-widest font-extrabold text-deshi-blue dark:text-blue-400">Players in Game</p>
        <div className="grid grid-cols-2 gap-2">
          {players.map((p) => (
            <div key={p.id} className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-deshi-blue dark:bg-blue-600 flex items-center justify-center font-extrabold text-white text-xs shadow-sm shrink-0">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name} {p.id === currentPlayerId && <span className="text-deshi-blue dark:text-blue-400">(You)</span>}</span>
            </div>
          ))}
        </div>
      </div>

      {isHost && (
        <button onClick={() => { sfx.play("back"); onEndRound(); }} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 py-1 font-bold underline cursor-pointer">
          Host: End round early
        </button>
      )}
    </div>
  );
}
