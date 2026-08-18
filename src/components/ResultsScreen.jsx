"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, RotateCcw } from "lucide-react";

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
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: isWinnerSpy ? ["#DC2626", "#991B1B", "#FCA5A5"] : ["#0F4C81", "#2563EB", "#93C5FD"],
    });
  }, [isWinnerSpy]);

  return (
    <div className="w-full flex flex-col items-center gap-5 py-4 animate-fadeIn">

      {/* Winner Header Banner */}
      <div className={`w-full text-center space-y-3 rounded-3xl p-7 border-2 shadow-xl ${
        isWinnerSpy
          ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/60 dark:to-red-900/40 border-red-300 dark:border-red-800 shadow-red-200/60 dark:shadow-red-950/40"
          : "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 border-blue-300 dark:border-blue-800 shadow-blue-200/60 dark:shadow-blue-950/40"
      }`}>
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full shadow-lg mb-1 ${
          isWinnerSpy ? "bg-red-100 dark:bg-red-900/60 border-2 border-red-300 dark:border-red-700" : "bg-blue-100 dark:bg-blue-900/60 border-2 border-blue-300 dark:border-blue-700"
        }`}>
          <Trophy className={`w-8 h-8 ${isWinnerSpy ? "text-deshi-red" : "text-deshi-blue dark:text-blue-400"}`} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          {isWinnerSpy ? "The Spy Wins! 🕵️‍♂️" : "Citizens Win! 🎉"}
        </h2>
        <p className={`text-sm font-semibold ${isWinnerSpy ? "text-red-700 dark:text-red-300" : "text-blue-700 dark:text-blue-300"}`}>
          {isWinnerSpy
            ? "The Spy successfully blended in or guessed the location!"
            : "The citizens caught the Spy red-handed!"}
        </p>
      </div>

      {/* Role & Location Summary Card */}
      <div className="deshi-card w-full space-y-3">
        <h3 className="text-xs uppercase tracking-widest font-extrabold text-deshi-blue dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2">
          Round Summary
        </h3>

        {/* Location reveal */}
        <div className="flex items-center justify-between bg-blue-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-100 dark:border-slate-700">
          <span className="text-xs text-blue-700 dark:text-blue-400 font-extrabold uppercase tracking-wide">Location</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">{roomData?.location?.emoji}</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {roomData?.location?.name}
            </span>
          </div>
        </div>

        {/* Spy identity reveal */}
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/40 p-3.5 rounded-2xl border border-red-100 dark:border-red-900/60">
          <span className="text-xs text-red-700 dark:text-red-400 font-extrabold uppercase tracking-wide">The Spy Was</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕵️</span>
            <span className="text-base font-extrabold text-deshi-red">
              {spy?.name || "Unknown"}
            </span>
          </div>
        </div>

        {/* Spy Guess Note if applicable */}
        {roomData?.spyGuess && (
          <div className={`p-3.5 rounded-2xl text-xs space-y-1 border ${
            roomData.spyGuess === roomData?.location?.name
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60"
              : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
          }`}>
            <p className="font-extrabold text-slate-800 dark:text-slate-200">
              Spy Guessed: <span className="text-deshi-blue dark:text-blue-400">{roomData.spyGuess}</span>
            </p>
            <p className={`font-semibold ${
              roomData.spyGuess === roomData?.location?.name ? "text-amber-700 dark:text-amber-300" : "text-slate-500 dark:text-slate-400"
            }`}>
              {roomData.spyGuess === roomData?.location?.name
                ? "✅ Correct — Spy wins instantly!"
                : "❌ Wrong guess — Citizens win!"}
            </p>
          </div>
        )}
      </div>

      {/* Player Roles Breakdown */}
      <div className="deshi-card w-full space-y-3">
        <h3 className="text-xs uppercase tracking-widest font-extrabold text-deshi-blue dark:text-blue-400">
          All Players & Roles
        </h3>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {players.map((p) => (
            <div
              key={p.id}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                p.isSpy
                  ? "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900/60"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm ${
                  p.isSpy ? "bg-deshi-red" : "bg-deshi-blue dark:bg-blue-600"
                }`}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {p.name} {p.id === currentPlayerId && "(You)"}
                </span>
              </div>
              <span className={`font-extrabold ${p.isSpy ? "text-deshi-red" : "text-slate-600 dark:text-slate-300"}`}>
                {p.isSpy ? "Spy 🕵️" : p.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Replay Loop Trigger */}
      {isHost ? (
        <button onClick={onPlayAgain} className="deshi-btn-blue w-full">
          <RotateCcw className="w-5 h-5" />
          <span>Play Again!</span>
        </button>
      ) : (
        <div className="w-full text-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold animate-pulse">
            Waiting for Host ({players.find((p) => p.id === roomData?.hostId)?.name || "Host"}) to start a new round...
          </p>
        </div>
      )}
    </div>
  );
}
