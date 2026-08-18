"use client";

import { useState } from "react";
import { Users, PlusCircle, LogIn, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getSoundEngine } from "../lib/sounds";

export default function HomeScreen({ onCreateRoom, onJoinRoom }) {
  const [mode, setMode] = useState("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [error, setError] = useState("");
  const sfx = getSoundEngine();

  const goTo = (m) => { sfx.play("click"); setError(""); setMode(m); };
  const goBack = () => { sfx.play("back"); setError(""); setMode("menu"); };

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
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-2 ring-blue-100">
            <Image src="/logo.png" alt="Deshi Spyfall Logo" fill style={{ objectFit: "cover" }} priority />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Deshi <span className="text-deshi-red">Spyfall</span>
          </h1>
          <p className="text-deshi-blue font-bold text-sm mt-0.5">🕵️ Who is the Spy?</p>
        </div>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          A party game for Bangladeshi friends in the same room.<br />One Spy, everyone else knows the location!
        </p>
      </div>

      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-3.5 rounded-2xl text-center shadow-sm animate-fadeIn">
          ⚠️ {error}
        </div>
      )}

      {/* Main Menu */}
      {mode === "menu" && (
        <div className="w-full space-y-3 animate-fadeIn">
          <button onClick={() => goTo("create")} className="deshi-btn-blue w-full group">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Create Room
          </button>
          <button onClick={() => goTo("join")} className="deshi-btn-red w-full group">
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Join Room
          </button>
          <div className="flex gap-3 pt-1">
            <div className="flex-1 bg-white/80 border border-slate-200 rounded-2xl p-3 text-center text-xs text-slate-500 font-medium shadow-sm">
              🏏 12 Locations
            </div>
            <div className="flex-1 bg-white/80 border border-slate-200 rounded-2xl p-3 text-center text-xs text-slate-500 font-medium shadow-sm">
              👥 3-12 Players
            </div>
            <div className="flex-1 bg-white/80 border border-slate-200 rounded-2xl p-3 text-center text-xs text-slate-500 font-medium shadow-sm">
              ⏱ 5–10 Min
            </div>
          </div>
        </div>
      )}

      {/* Create Room Form */}
      {mode === "create" && (
        <form onSubmit={handleCreateSubmit} className="deshi-card w-full space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <button type="button" onClick={goBack} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" aria-label="Go Back">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-extrabold text-slate-900">Create a New Room</h2>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Tanvir, Sakib…"
              maxLength={16}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-deshi-blue focus:ring-2 focus:ring-blue-100 font-semibold transition-all"
              autoFocus
            />
          </div>
          <button type="submit" onClick={() => sfx.play("click")} className="deshi-btn-blue w-full">
            Create Room & Become Host 🚀
          </button>
        </form>
      )}

      {/* Join Room Form */}
      {mode === "join" && (
        <form onSubmit={handleJoinSubmit} className="deshi-card w-full space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <button type="button" onClick={goBack} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" aria-label="Go Back">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-extrabold text-slate-900">Join Existing Room</h2>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Room Code</label>
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="DHAK"
              maxLength={4}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 text-center font-black text-2xl tracking-[0.5em] uppercase placeholder-slate-300 focus:outline-none focus:border-deshi-red focus:ring-2 focus:ring-red-100 transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Rahat, Nabil…"
              maxLength={16}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-deshi-red focus:ring-2 focus:ring-red-100 font-semibold transition-all"
            />
          </div>
          <button type="submit" onClick={() => sfx.play("click")} className="deshi-btn-red w-full">
            Join Game 🎮
          </button>
        </form>
      )}

      <p className="text-xs text-slate-400 text-center">No account needed — share the room code verbally.</p>
    </div>
  );
}
