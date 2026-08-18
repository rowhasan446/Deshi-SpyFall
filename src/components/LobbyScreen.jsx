"use client";

import { Crown, Users, Clock, Play, Copy, Check, ArrowLeft } from "lucide-react";
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

  return (
    <div className="w-full flex flex-col items-center gap-4 py-3 animate-fadeIn">
      {/* Back / Leave button */}
      <div className="w-full flex items-center gap-3">
        <button
          onClick={() => { sfx.play("back"); onLeaveRoom?.(); }}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-deshi-blue dark:hover:text-blue-400 transition-colors py-1 px-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Leave Room
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium ml-auto">Lobby</span>
      </div>

      {/* Room Code Card */}
      <div className="deshi-card w-full text-center space-y-2 border-blue-100 dark:border-slate-800">
        <span className="text-[11px] uppercase tracking-widest text-deshi-blue dark:text-blue-400 font-extrabold">Share this Code</span>
        <div
          onClick={handleCopyCode}
          className="flex items-center justify-center gap-3 bg-blue-50 dark:bg-slate-800/80 py-4 px-6 rounded-2xl border border-blue-200 dark:border-slate-700 cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-800 transition-all group select-none"
        >
          <span className="text-5xl font-black font-mono tracking-[0.3em] text-deshi-blue dark:text-blue-400">
            {roomCode}
          </span>
          {copied ? <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <Copy className="w-5 h-5 text-blue-400 dark:text-slate-500 group-hover:text-deshi-blue dark:group-hover:text-blue-400 shrink-0 transition-colors" />}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{copied ? "Copied to clipboard!" : "Tap to copy"}</p>
      </div>

      {/* Players */}
      <div className="deshi-card w-full space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-deshi-blue dark:text-blue-400" /> Players ({players.length})
          </h2>
          <span className="text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full font-bold border border-blue-100 dark:border-blue-900">Need 3+</span>
        </div>
        <div className="space-y-2 max-h-52 overflow-y-auto">
          {players.map((p) => {
            const isMe = p.id === currentPlayerId;
            const isRoomHost = p.id === roomData.hostId;
            return (
              <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border ${isMe ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 font-bold" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-deshi-blue dark:bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name} {isMe && <span className="text-deshi-blue dark:text-blue-400">(You)</span>}</span>
                </div>
                {isRoomHost && (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full">
                    <Crown className="w-3 h-3" /> Host
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Host: Duration Picker */}
      {isHost && (
        <div className="deshi-card w-full space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800 dark:text-slate-200">
            <Clock className="w-4 h-4 text-deshi-blue dark:text-blue-400" /> Round Duration
          </div>
          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleDuration(opt.value)}
                className={`py-3 rounded-xl text-sm font-extrabold border transition-all cursor-pointer ${currentDuration === opt.value ? "bg-deshi-blue text-white border-blue-800 dark:bg-blue-600 dark:border-blue-500 shadow-md" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start / Waiting */}
      {isHost ? (
        <button
          onClick={handleStart}
          disabled={players.length < 3}
          className={`w-full ${players.length < 3 ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed py-4 rounded-2xl font-extrabold text-sm" : "deshi-btn-blue animate-pulse-glow"}`}
        >
          <Play className="w-5 h-5 fill-current" />
          {players.length < 3 ? `Need ${3 - players.length} more player${3 - players.length > 1 ? "s" : ""}…` : "Start Game!"}
        </button>
      ) : (
        <div className="w-full text-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 animate-pulse">
            Waiting for host ({players.find((p) => p.id === roomData.hostId)?.name || "Host"}) to start…
          </p>
        </div>
      )}
    </div>
  );
}
