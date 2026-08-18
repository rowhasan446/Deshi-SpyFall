"use client";

import { useState } from "react";
import { Vote, CheckCircle, MapPin } from "lucide-react";
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

  const handleInputFocus = (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleVoteSubmit = () => {
    if (!selectedTargetId) return;
    sfx.play("voteSubmit");
    onCastVote(selectedTargetId);
  };

  const handleSpyGuessSubmit = () => {
    if (!selectedLocationGuess) return;
    sfx.play("reveal");
    onSpyGuessLocation(selectedLocationGuess);
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 py-4 animate-fadeIn">
      {/* Vote Banner Header */}
      <div className="deshi-card-red w-full text-center space-y-2 border-red-200 dark:border-red-900/40">
        <div className="inline-flex items-center justify-center p-3 bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900 rounded-2xl text-deshi-red mb-1">
          <Vote className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {isSpyCaught ? "Spy Caught! Last Chance 🎯" : "Who is the Spy? Vote Now!"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {isSpyCaught
            ? "The Spy has one chance to guess the location and still win!"
            : "Select who you suspect. Votes sync in real time across phones."}
        </p>
        {!isSpyCaught && (
          <div className="pt-2 flex justify-center items-center gap-2 text-xs font-bold text-deshi-blue dark:text-blue-400">
            <span>Votes Received: {votedPlayersCount} / {totalPlayers}</span>
          </div>
        )}
      </div>

      {/* ── After all votes: Spy gets one last location guess ── */}
      {isSpyCaught && (
        <div className="deshi-card w-full space-y-4">
          {iCaughtSpy ? (
            <>
              <div className="flex items-center gap-2 text-sm font-bold text-deshi-red">
                <MapPin className="w-4 h-4" />
                <span>You were caught! Guess the Location to win</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                If you guess the correct location, you still win! Choose wisely.
              </p>
              <select
                value={selectedLocationGuess}
                onChange={(e) => setSelectedLocationGuess(e.target.value)}
                onFocus={handleInputFocus}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-deshi-blue dark:focus:border-blue-400 font-semibold"
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
                disabled={!selectedLocationGuess}
                className={`w-full ${
                  !selectedLocationGuess
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 py-3.5 rounded-2xl font-bold text-sm cursor-not-allowed"
                    : "deshi-btn-blue"
                }`}
              >
                Submit Location Guess 🎯
              </button>
            </>
          ) : (
            <div className="text-center p-5 space-y-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl">
              <div className="text-3xl">🕵️‍♂️</div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">The Spy was caught!</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold animate-pulse">
                Waiting for the Spy to make their final location guess…
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Regular voting: before all votes are in ── */}
      {!isSpyCaught && (
        <div className="deshi-card w-full space-y-3">
          {/* Spy's own early location-guess option */}
          {isSpy && !hasVoted && (
            <div className="border border-blue-200 dark:border-slate-700 bg-blue-50 dark:bg-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-deshi-blue dark:text-blue-400">
                <MapPin className="w-4 h-4" />
                <span>Spy Option: Guess the Location now</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Confident about the location? Guess it directly and win before the vote resolves!
              </p>
              <select
                value={selectedLocationGuess}
                onChange={(e) => setSelectedLocationGuess(e.target.value)}
                onFocus={handleInputFocus}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-deshi-blue dark:focus:border-blue-400 font-semibold"
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
                disabled={!selectedLocationGuess}
                className={`w-full text-sm ${
                  !selectedLocationGuess
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 py-3.5 rounded-2xl font-bold cursor-not-allowed"
                    : "deshi-btn-blue"
                }`}
              >
                Submit Location Guess 🎯
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">OR VOTE BELOW</span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
              </div>
            </div>
          )}

          <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400">
            Select Suspect:
          </h3>

          {hasVoted ? (
            <div className="text-center p-6 space-y-2 bg-blue-50/60 dark:bg-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-800">
              <CheckCircle className="w-10 h-10 text-deshi-blue dark:text-blue-400 mx-auto" />
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">Your Vote Has Been Submitted!</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold animate-pulse">
                Waiting for remaining players ({totalPlayers - votedPlayersCount} left)…
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((p) => {
                const isMe = p.id === currentPlayerId;
                const isSelected = selectedTargetId === p.id;

                return (
                  <button
                    key={p.id}
                    disabled={isMe}
                    onClick={() => setSelectedTargetId(p.id)}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isMe
                        ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                        : isSelected
                        ? "bg-red-50 dark:bg-red-950/60 border-deshi-red text-slate-900 dark:text-white font-bold shadow-md"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-deshi-blue dark:bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold">
                        {p.name} {isMe && "(You)"}
                      </span>
                    </div>
                    {isSelected && <Vote className="w-5 h-5 text-deshi-red" />}
                  </button>
                );
              })}

              <button
                onClick={handleVoteSubmit}
                disabled={!selectedTargetId}
                className={`w-full mt-3 ${
                  !selectedTargetId
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 py-3.5 rounded-2xl font-bold text-sm cursor-not-allowed"
                    : "deshi-btn-red"
                }`}
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
