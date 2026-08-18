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

  // Keep a ref to playerId so callbacks never capture a stale closure
  const playerIdRef = useRef(playerId);
  useEffect(() => { playerIdRef.current = playerId; }, [playerId]);

  // Restore local session from sessionStorage (tab-isolated session storage) on load
  useEffect(() => {
    const savedRoom = sessionStorage.getItem("deshi_spyfall_room");
    const savedPlayer = sessionStorage.getItem("deshi_spyfall_player");
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

      // If offline and we just joined (hostId is empty), send JOIN_REQUEST to host
      if (!database && roomData && roomData.hostId === "") {
        const myPlayer = roomData.players?.[playerIdRef.current];
        if (myPlayer) {
          bc.postMessage({ type: "JOIN_REQUEST", player: myPlayer });
        }
      }

      bc.onmessage = (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;

        // If Firebase is active, we let Firebase handle synchronization
        if (database) return;

        // Offline / local BroadcastChannel synchronization logic:
        switch (msg.type) {
          case "JOIN_REQUEST": {
            // Only the Host handles join requests and updates the master roomData
            if (roomData && roomData.hostId === playerIdRef.current) {
              const updatedRoomData = {
                ...roomData,
                players: {
                  ...roomData.players,
                  [msg.player.id]: msg.player
                }
              };
              setRoomData(updatedRoomData);
              // Broadcast the new master state to everyone
              bc.postMessage({ type: "ROOM_UPDATE", roomData: updatedRoomData });
            }
            break;
          }
          case "ROOM_UPDATE": {
            // Everyone accepts the Host's authoritative state
            setRoomData(msg.roomData);
            break;
          }
          case "VOTE_CAST": {
            // When someone votes, if we are the Host, update the master state
            if (roomData && roomData.hostId === playerIdRef.current) {
              const updatedRoomData = {
                ...roomData,
                players: {
                  ...roomData.players,
                  [msg.voterId]: {
                    ...roomData.players[msg.voterId],
                    hasVoted: true,
                    voteFor: msg.targetId
                  }
                }
              };
              // Check if all voted
              const playersArr = Object.values(updatedRoomData.players);
              const allVoted = playersArr.every((p) => p.hasVoted);
              if (allVoted) {
                // Host finalizes voting
                handleFinalizeVoting(updatedRoomData);
              } else {
                setRoomData(updatedRoomData);
                bc.postMessage({ type: "ROOM_UPDATE", roomData: updatedRoomData });
              }
            }
            break;
          }
          case "LEAVE": {
            // Remove the player from list
            if (roomData && roomData.hostId === playerIdRef.current) {
              const updatedPlayers = { ...roomData.players };
              delete updatedPlayers[msg.playerId];
              const updatedRoomData = {
                ...roomData,
                players: updatedPlayers
              };
              setRoomData(updatedRoomData);
              bc.postMessage({ type: "ROOM_UPDATE", roomData: updatedRoomData });
            }
            break;
          }
          default:
            break;
        }
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
  }, [roomCode, roomData]);

  // Broadcast helper when updating room state
  const broadcastRoomUpdate = (newData) => {
    try {
      if (roomCode) {
        const bc = new BroadcastChannel(`deshi_spyfall_${roomCode}`);
        bc.postMessage({ type: "ROOM_UPDATE", roomData: newData });
        bc.close();
      }
    } catch (e) {}
  };

  const updateRoomState = (newData, code = roomCode) => {
    setRoomData(newData);
    if (!database) {
      broadcastRoomUpdate(newData);
    }
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

    updateRoomState(initialRoomData, newRoomCode);
    setRoomCode(newRoomCode);
    setPlayerId(newPlayerId);
    playerIdRef.current = newPlayerId;
    sessionStorage.setItem("deshi_spyfall_room", newRoomCode);
    sessionStorage.setItem("deshi_spyfall_player", newPlayerId);
    setLoading(false);

    safeSet(`rooms/${newRoomCode}`, initialRoomData);
  };

  // ─── Join Room ────────────────────────────────────────────────────────────
  const handleJoinRoom = async (codeToJoin, playerName) => {
    setLoading(true);
    const newPlayerId = playerIdRef.current || generatePlayerId();

    const newPlayerData = {
      id: newPlayerId,
      name: playerName,
      isHost: false,
      hasVoted: false,
      voteFor: null,
    };

    setRoomCode(codeToJoin);
    setPlayerId(newPlayerId);
    playerIdRef.current = newPlayerId;
    sessionStorage.setItem("deshi_spyfall_room", codeToJoin);
    sessionStorage.setItem("deshi_spyfall_player", newPlayerId);

    if (database) {
      let existingRoomData = await safeGet(`rooms/${codeToJoin}`);
      const updatedRoomData = {
        ...(existingRoomData || { hostId: newPlayerId, status: "lobby", roundDuration: 480 }),
        players: {
          ...(existingRoomData?.players || {}),
          [newPlayerId]: newPlayerData,
        },
      };
      updateRoomState(updatedRoomData, codeToJoin);
      setLoading(false);
      safeSet(`rooms/${codeToJoin}/players/${newPlayerId}`, newPlayerData);
    } else {
      // Offline / Local Broadcast Mode: Set initial state with self in lobby
      // and let the BroadcastChannel listener send JOIN_REQUEST to host once it's open
      const initialJoinerRoomData = {
        hostId: "", // Will be updated by Host's ROOM_UPDATE response
        status: "lobby",
        roundDuration: 480,
        players: {
          [newPlayerId]: newPlayerData
        }
      };
      updateRoomState(initialJoinerRoomData, codeToJoin);
      setLoading(false);
    }
  };

  // ─── Leave Room ───────────────────────────────────────────────────────────
  const handleLeaveRoom = () => {
    if (roomCode && playerId) {
      if (database) {
        safeUpdate(`rooms/${roomCode}/players/${playerId}`, null);
      } else {
        try {
          const bc = new BroadcastChannel(`deshi_spyfall_${roomCode}`);
          bc.postMessage({ type: "LEAVE", playerId: playerId });
          bc.close();
        } catch (e) {}
      }
    }
    sessionStorage.removeItem("deshi_spyfall_room");
    sessionStorage.removeItem("deshi_spyfall_player");
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

    if (database) {
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
    } else {
      // Offline mode: send vote to Host tab
      try {
        const bc = new BroadcastChannel(`deshi_spyfall_${roomCode}`);
        bc.postMessage({ type: "VOTE_CAST", voterId: playerIdRef.current, targetId: targetPlayerId });
        bc.close();
      } catch (e) {}
    }
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

    const nextStatus = caughtSpy ? "voting" : "results";
    const winner = caughtSpy ? null : "spy";

    const nextRoomData = {
      ...currentRoom,
      status: caughtSpy ? "voting" : "results",
      winner,
      caughtSpyId: caughtSpy ? currentRoom.spyId : null,
    };
    
    // Update local state and broadcast
    updateRoomState(nextRoomData);

    if (database) {
      const updatePayload = {
        status: nextStatus,
        winner,
        caughtSpyId: caughtSpy ? currentRoom.spyId : null,
      };
      safeUpdate(`rooms/${roomCode}`, updatePayload);
    }
  };

  // ─── Play Again ───────────────────────────────────────────────────────────
  const handlePlayAgain = () => {
    if (!roomCode || !roomData?.players) return;

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
