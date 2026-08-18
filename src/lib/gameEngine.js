import { LOCATIONS } from "../data/locations";

/**
 * Generate a random 4-letter uppercase room code
 */
export function generateRoomCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
}

/**
 * Generate a random unique player ID
 */
export function generatePlayerId() {
  return "p_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Select a random location and distribute roles among players
 * Returns { location, spyId, playerRoles }
 */
export function distributeRoles(playersMap) {
  const playerIds = Object.keys(playersMap);
  if (playerIds.length === 0) return null;

  // Pick random location
  const randomIndex = Math.floor(Math.random() * LOCATIONS.length);
  const selectedLocation = LOCATIONS[randomIndex];

  // Pick random spy
  const spyIndex = Math.floor(Math.random() * playerIds.length);
  const spyId = playerIds[spyIndex];

  // Shuffle roles available in this location
  const shuffledRoles = [...selectedLocation.roles].sort(() => 0.5 - Math.random());

  const playerRoles = {};
  let roleIdx = 0;

  playerIds.forEach((pId) => {
    if (pId === spyId) {
      playerRoles[pId] = {
        isSpy: true,
        role: "Tumi Chor! 🕵️",
      };
    } else {
      // Assign role (loop around if more players than roles)
      const role = shuffledRoles[roleIdx % shuffledRoles.length];
      playerRoles[pId] = {
        isSpy: false,
        role: role,
      };
      roleIdx++;
    }
  });

  return {
    location: selectedLocation,
    spyId,
    playerRoles,
  };
}

/**
 * Calculate voting result
 * Returns { mostVotedPlayerId, voteCount, isTie, votesSummary }
 */
export function calculateVotes(playersMap) {
  const tally = {};
  let totalVotes = 0;

  Object.values(playersMap).forEach((player) => {
    if (player.voteFor) {
      tally[player.voteFor] = (tally[player.voteFor] || 0) + 1;
      totalVotes++;
    }
  });

  let maxVotes = 0;
  let mostVotedPlayerId = null;
  let isTie = false;

  Object.entries(tally).forEach(([pId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      mostVotedPlayerId = pId;
      isTie = false;
    } else if (count === maxVotes) {
      isTie = true;
    }
  });

  return {
    mostVotedPlayerId,
    maxVotes,
    isTie,
    tally,
    totalVotes,
  };
}
