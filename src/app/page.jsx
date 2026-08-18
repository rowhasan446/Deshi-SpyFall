"use client";

import { useState, useEffect, useRef } from "react";
import { database, ref, onValue, off, safeSet, safeUpdate, safeGet } from "../lib/firebase";
import { generateRoomCode, generatePlayerId, distributeRoles, calculateVotes } from "../lib/gameEngine";

import HomeScreen from "../components/HomeScreen";
import LobbyScreen from "../components/LobbyScreen";
import RoleRevealScreen from "../components/RoleRevealScreen";
import GameScreen from "../components/GameScreen";
import VotingScreen from "../components/VotingScreen";
import ResultsScreen from "../components/ResultsScreen";
import SoundEffects from "../components/SoundEffects";

export default function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Keep a ref to playerId so Firebase callbacks never capture a stale closure
  const playerIdRef = useRef(playerId);
  useEffect(() => { playerIdRef.current = playerId; }, [playerId]);

  // Restore local session on load
  useEffect(() => {
    const savedRoom = localStorage.getItem("deshi_spyfall_room");
    const savedPlayer = localStorage.getItem("deshi_spyfall_player");
    if (savedRoom && savedPlayer) {
      setRoomCode(savedRoom);
      setPlayerId(savedPlayer);
      playerIdRef.current = savedPlayer;
    }
  }, []);

  // Listen to Realtime Database & Local Broadcast updates for the active room
  useEffect(() => {
    if (!roomCode) {
      setRoomData(null);
      return;
    }

    // Multi-tab / local dev synchronization channel
    let bc;
    try {
      bc = new BroadcastChannel(`deshi_spyfall_${roomCode}`);
      bc.onmessage = (event) => {
        if (event.data) setRoomData(event.data);
      };
    } catch (e) {}

    // Listen to Firebase if database is connected
    let roomRef;
    if (database) {
      try {
        roomRef = ref(database, `rooms/${roomCode}`);
        onValue(roomRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setRoomData(data);

            // Auto-finalize voting once all players have voted (host only)
            if (data.status === "voting" && data.players) {
              const playersArr = Object.values(data.players);
              const allVoted = playersArr.every((p) => p.hasVoted);
              if (allVoted && data.hostId === playerIdRef.current) {
                handleFinalizeVoting(data);
              }
            }
          }
        });
      } catch (e) {}
    }

    return () => {
      if (database && roomRef) off(roomRef);
      if (bc) bc.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  // Broadcast room state changes to other tabs (local dev multi-tab sync)
  const broadcastRoomState = (newData, code = roomCode) => {
    try {
      if (code) {
        const bc = new BroadcastChannel(`deshi_spyfall_${code}`);
        bc.postMessage(newData);
        bc.close();
      }
    } catch (e) {}
  };

  const updateRoomState = (newData, code = roomCode) => {
    setRoomData(newData);
    broadcastRoomState(newData, code);
  };

  // ─── Create Room ──────────────────────────────────────────────────────────
  const handleCreateRoom = (playerName) => {
    setLoading(true);
    const newRoomCode = generateRoomCode();
    const newPlayerId = generatePlayerId();

    const initialRoomData = {
      hostId: newPlayerId,
      status: "lobby",
      roundDuration: 480,
      players: {
        [newPlayerId]: {
          id: newPlayerId,
          name: playerName,
          isHost: true,
          hasVoted: false,
          voteFor: null,
        },
      },
    };

    // Update local state immediately
    updateRoomState(initialRoomData, newRoomCode);
    setRoomCode(newRoomCode);
    setPlayerId(newPlayerId);
    playerIdRef.current = newPlayerId;
    localStorage.setItem("deshi_spyfall_room", newRoomCode);
    localStorage.setItem("deshi_spyfall_player", newPlayerId);
    setLoading(false);

    // Sync to Firebase in background
    safeSet(`rooms/${newRoomCode}`, initialRoomData);
  };

  // ─── Join Room ────────────────────────────────────────────────────────────
  const handleJoinRoom = async (codeToJoin, playerName) => {
    setLoading(true);
    const newPlayerId = playerIdRef.current || generatePlayerId();

    // Fetch existing room data from Firebase first so we have all current players
    let existingRoomData = await safeGet(`rooms/${codeToJoin}`);

    // Fall back to current roomData if offline and already loaded
    if (!existingRoomData && roomData) {
      existingRoomData = roomData;
    }

    const newPlayerData = {
      id: newPlayerId,
      name: playerName,
      isHost: false,
      hasVoted: false,
      voteFor: null,
    };

    const updatedRoomData = {
      ...(existingRoomData || { hostId: newPlayerId, status: "lobby", roundDuration: 480 }),
      players: {
        ...(existingRoomData?.players || {}),
        [newPlayerId]: newPlayerData,
      },
    };

    // Optimistic local update
    updateRoomState(updatedRoomData, codeToJoin);
    setRoomCode(codeToJoin);
    setPlayerId(newPlayerId);
    playerIdRef.current = newPlayerId;
    localStorage.setItem("deshi_spyfall_room", codeToJoin);
    localStorage.setItem("deshi_spyfall_player", newPlayerId);
    setLoading(false);

    // Sync player to Firebase
    safeSet(`rooms/${codeToJoin}/players/${newPlayerId}`, newPlayerData);
  };

  // ─── Leave Room ───────────────────────────────────────────────────────────
  const handleLeaveRoom = () => {
    // Remove player from Firebase if possible
    if (roomCode && playerId) {
      safeUpdate(`rooms/${roomCode}/players/${playerId}`, null);
    }
    localStorage.removeItem("deshi_spyfall_room");
    localStorage.removeItem("deshi_spyfall_player");
    setRoomCode(null);
    setPlayerId(null);
    setRoomData(null);
    playerIdRef.current = null;
  };

  // ─── Update Duration ──────────────────────────────────────────────────────
  const handleUpdateDuration = (durationSeconds) => {
    if (!roomCode) return;
    const updated = { ...roomData, roundDuration: durationSeconds };
    updateRoomState(updated);
    safeUpdate(`rooms/${roomCode}`, { roundDuration: durationSeconds });
  };

  // ─── Start Game ───────────────────────────────────────────────────────────
  const handleStartGame = () => {
    if (!roomCode || !roomData?.players) return;

    const distribution = distributeRoles(roomData.players);
    if (!distribution) return;

    const updatedPlayers = { ...roomData.players };
    Object.keys(updatedPlayers).forEach((pId) => {
      const roleData = distribution.playerRoles[pId];
      updatedPlayers[pId] = {
        ...updatedPlayers[pId],
        isSpy: roleData.isSpy,
        role: roleData.role,
        hasVoted: false,
        voteFor: null,
      };
    });

    const nextRoomData = {
      ...roomData,
      status: "reveal",
      location: distribution.location,
      spyId: distribution.spyId,
      spyGuess: null,
      winner: null,
      players: updatedPlayers,
    };

    updateRoomState(nextRoomData);
    safeSet(`rooms/${roomCode}`, nextRoomData);
  };

  // ─── Proceed to Game ──────────────────────────────────────────────────────
  const handleProceedToGame = () => {
    if (!roomCode) return;
    const startTime = Date.now();
    const nextRoomData = { ...roomData, status: "playing", startTime };
    updateRoomState(nextRoomData);
    safeUpdate(`rooms/${roomCode}`, { status: "playing", startTime });
  };

  // ─── Call Vote ────────────────────────────────────────────────────────────
  const handleCallVote = () => {
    if (!roomCode) return;
    const nextRoomData = { ...roomData, status: "voting", votingStartedBy: playerIdRef.current };
    updateRoomState(nextRoomData);
    safeUpdate(`rooms/${roomCode}`, { status: "voting", votingStartedBy: playerIdRef.current });
  };

  // ─── Cast Vote ────────────────────────────────────────────────────────────
  const handleCastVote = (targetPlayerId) => {
    if (!roomCode || !playerIdRef.current) return;

    const updatedPlayers = {
      ...roomData.players,
      [playerIdRef.current]: {
        ...roomData.players[playerIdRef.current],
        hasVoted: true,
        voteFor: targetPlayerId,
      },
    };
    const nextRoomData = { ...roomData, players: updatedPlayers };
    updateRoomState(nextRoomData);

    safeUpdate(`rooms/${roomCode}/players/${playerIdRef.current}`, {
      hasVoted: true,
      voteFor: targetPlayerId,
    });
  };

  // ─── Spy Location Guess ───────────────────────────────────────────────────
  const handleSpyGuessLocation = (guessedLocationName) => {
    if (!roomCode) return;
    const isCorrect = guessedLocationName === roomData?.location?.name;

    const nextRoomData = {
      ...roomData,
      status: "results",
      spyGuess: guessedLocationName,
      winner: isCorrect ? "spy" : "citizens",
    };
    updateRoomState(nextRoomData);
    safeUpdate(`rooms/${roomCode}`, {
      status: "results",
      spyGuess: guessedLocationName,
      winner: isCorrect ? "spy" : "citizens",
    });
  };

  // ─── Finalize Voting ──────────────────────────────────────────────────────
  const handleFinalizeVoting = (currentRoom) => {
    const votingSummary = calculateVotes(currentRoom.players);
    const caughtSpy =
      votingSummary.mostVotedPlayerId === currentRoom.spyId && !votingSummary.isTie;

    // If spy is caught, give them a chance to guess — don't go to results yet
    // (spy can still submit a location guess from VotingScreen)
    // Only auto-go to results when spy is NOT caught (citizens lose)
    const nextStatus = caughtSpy ? "voting" : "results";
    const winner = caughtSpy ? null : "spy";

    // If spy is caught: keep status "voting" so the spy can see the guess modal
    // Add a caughtSpyId field so VotingScreen shows the guess modal to the spy
    const nextRoomData = {
      ...currentRoom,
      status: caughtSpy ? "voting" : "results",
      winner,
      caughtSpyId: caughtSpy ? currentRoom.spyId : null,
    };
    setRoomData(nextRoomData);
    broadcastRoomState(nextRoomData);

    const updatePayload = {
      status: nextStatus,
      winner,
      caughtSpyId: caughtSpy ? currentRoom.spyId : null,
    };
    safeUpdate(`rooms/${roomCode}`, updatePayload);
  };

  // ─── Play Again ───────────────────────────────────────────────────────────
  const handlePlayAgain = () => {
    if (!roomCode || !roomData?.players) return;

    // Clear all game-round state from every player
    const resetPlayers = {};
    Object.entries(roomData.players).forEach(([pId, p]) => {
      resetPlayers[pId] = {
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        hasVoted: false,
        voteFor: null,
        isSpy: false,
        role: null,
      };
    });

    const nextRoomData = {
      ...roomData,
      status: "lobby",
      location: null,
      spyId: null,
      spyGuess: null,
      winner: null,
      caughtSpyId: null,
      votingStartedBy: null,
      startTime: null,
      players: resetPlayers,
    };
    updateRoomState(nextRoomData);
    safeSet(`rooms/${roomCode}`, nextRoomData);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  const currentStatus = roomData?.status || "home";

  return (
    <div className="w-full">
      <SoundEffects />

      {(!roomCode || !roomData) && (
        <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} loading={loading} />
      )}

      {roomCode && roomData && currentStatus === "lobby" && (
        <LobbyScreen
          roomCode={roomCode}
          roomData={roomData}
          currentPlayerId={playerId}
          onStartGame={handleStartGame}
          onUpdateDuration={handleUpdateDuration}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {roomCode && roomData && currentStatus === "reveal" && (
        <RoleRevealScreen
          roomData={roomData}
          currentPlayerId={playerId}
          onProceedToGame={handleProceedToGame}
        />
      )}

      {roomCode && roomData && currentStatus === "playing" && (
        <GameScreen
          roomData={roomData}
          currentPlayerId={playerId}
          onCallVote={handleCallVote}
          onEndRound={handleCallVote}
        />
      )}

      {roomCode && roomData && currentStatus === "voting" && (
        <VotingScreen
          roomData={roomData}
          currentPlayerId={playerId}
          onCastVote={handleCastVote}
          onSpyGuessLocation={handleSpyGuessLocation}
        />
      )}

      {roomCode && roomData && currentStatus === "results" && (
        <ResultsScreen
          roomData={roomData}
          currentPlayerId={playerId}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
