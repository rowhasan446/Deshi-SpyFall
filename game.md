# Deshi Spyfall (Chor Ke?) - Project Documentation & Progress Log

## Overview
**Deshi Spyfall** is a mobile-first, Bangladeshi-themed party game built with Next.js (App Router, JSX, Tailwind CSS) and Firebase Realtime Database. It is modeled after the classic game Spyfall, localized with Bangladeshi spots, slang, and microcopy ("Chor Ke?", "Room Banao", "Tumi Chor! 🕵️").

---

## Technical Stack & Specifications
- **Framework**: Next.js 14+ (App Router, JavaScript / JSX, React 18/19)
- **Styling**: Tailwind CSS (Mobile-first, warm Bengali palette with Deep Green `#006A4E`, Crimson Red `#F42A41`, Golden Yellow accents)
- **Database / Realtime Sync**: Firebase Realtime Database (Room-based pub/sub sync via unique 4-letter room codes)
- **Animations**: `framer-motion` for tap-to-reveal card animations and dynamic screen transitions
- **Audio & Visuals**: `canvas-confetti` / Web Audio API sounds for role reveal, countdown timers, and victory states
- **Deployment**: Vercel-ready with client-side Firebase environment variable support

---

## Data Model (Firebase Realtime Database)
```json
/rooms/{roomCode}/
  - hostId: string (playerId of host)
  - status: "lobby" | "reveal" | "playing" | "voting" | "results"
  - location: { name: string, emoji: string }
  - spyId: string (playerId of assigned spy)
  - roundDuration: number (seconds: 300 / 480 / 600)
  - startTime: timestamp (server timestamp when game started)
  - endTime: timestamp (calculated end time)
  - votingStartedBy: string (playerId who called vote)
  - spyGuess: string (location guessed by spy if applicable)
  - winner: "citizens" | "spy" | null
  - players/
    - {playerId}:
      - id: string
      - name: string
      - role: string (or null for spy)
      - isSpy: boolean
      - hasVoted: boolean
      - voteFor: string (playerId voted against)
      - isHost: boolean
```

---

## Game Flow & Features

### 1. Home Screen (`/`)
- Brand header: **Deshi Spyfall (দেশী স্পাইফল / চোর কে?)**
- **Create Room**: Input player name -> Generates 4-letter code (e.g., `DHAK`) -> Redirects/Loads lobby as Host.
- **Join Room**: Input 4-letter code + player name -> Syncs player to room.
- **Rejoin Session**: Preserves player session in `localStorage` so refreshing phone reconnects seamlessly.

### 2. Lobby Screen
- Prominently displays Room Code for in-person verbal sharing.
- Realtime synchronized list of joined players (shows host badge).
- Host Controls: Select round duration (5, 8, 10 minutes), host transfer/kick if needed.
- "Khela Shuru Koro" (Start Game) button enabled when **3+ players** join.

### 3. Role Reveal Screen
- Private phone display:
  - **Citizens**: Shows Bangladeshi Location + Specific unique role + Emoji.
  - **Chor (Spy)**: Shows **"Tumi Chor! 🕵️"** with instructions to blend in and guess the location.
- **Hold-to-Reveal Interaction**: Card requires long-press/holding to reveal secret role to prevent shoulder peeking in a group setting.

### 4. Active Game Screen
- Live synchronized countdown timer (based on Firebase `startTime` / `endTime`).
- Grid list of players and location list reference (to help everyone and the Chor remember possible locations).
- "Vote Call Koro!" button to immediately halt timer and trigger voting.
- Host quick controls: Pause round / End round early.

### 5. Voting Screen
- Each player selects who they suspect is the **Chor**.
- Realtime vote tracker (shows how many players have voted).
- Once all votes are cast (or timer expires), majority vote is calculated:
  - If Chor was caught: Chor gets 1 chance to **"Guess the Location"** from a dropdown list.
  - If Chor guesses correctly -> Chor Wins! If incorrect -> Citizens Win!
  - If Chor was not caught -> Chor Wins!

### 6. Results Screen
- Dramatic reveal: Reveals the Chor's identity, the true location, and the ultimate winner.
- "Abar Khelbo" (Play Again) button: Resets room state, keeps players connected, picks new location + roles.

---

## Hardcoded Bangladeshi Locations & Roles (`src/data/locations.js`)
1. **Mirpur Stadium 🏏**: Bowler, Umpire, Ticket Blackér, Commentator, Vuvuzela Fan, Pitch Inspector
2. **CNG Stand 🛺**: Driver, Passenger, Meter-Checker Police, Chada Tola Bhai, Gas Pump Attendant
3. **Local Mosque (Jumma) 🕌**: Imam Shaheb, Muezzin, Slipper Guard, Latecomer, Attar Seller
4. **Biye Bari (Wedding) 💒**: Bor/Kone, Caterer, DJ Bhai, Uninvited Relative, Photographer, Kacchi Enthusiast
5. **Kamalapur Railway Station 🚉**: TT, Coolie, Chotpoti Hawker, Pickpocket, Waiting Passenger
6. **Coaching Center 📚**: Teacher, Back-bencher, Waiting Guardian, Photocopy Wala, Exam Topper
7. **New Market / Bongo Bazar 🛍️**: Dokandar, Bargaining Customer, Rickshaw Puller, Shoplifter, Helper
8. **Government Hospital 🏥**: Doctor, Nurse, Tokenwala, Sleeping Attendant, Medical Representative
9. **Boishakhi Mela 🎡**: Nagordola Operator, Jilapi Seller, Pickpocket, Murgir Lorai Organizer, Ektara Player
10. **Dhaka Traffic Jam 🚦**: Bus Driver, Bike Rider, Traffic Sarjeant, Water Bottle Hawker, VIP Escort Vehicle
11. **Corporate Office 🏢**: Boss, Chill Employee, Tea-serving Peon, IT Guy, HR Executive
12. **Sadharghat Launch Terminal 🚢**: Launch Captain, Cabin Boy, Fruit Hawker, Porter, Seasick Passenger

---

## Project Structure
```
Deshi SpyFall/
├── game.md                           # This state & documentation file
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── public/
│   ├── manifest.json                 # PWA manifest setup
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.jsx                # Root layout with mobile meta, fonts, styles
    │   ├── page.jsx                  # Main single-page application router state
    │   └── globals.css               # Custom CSS variables, glassmorphism & Bengali styles
    ├── components/
    │   ├── HomeScreen.jsx            # Create/Join flow with Bangla UI microcopy
    │   ├── LobbyScreen.jsx           # Player list, Host duration picker, start trigger
    │   ├── RoleRevealScreen.jsx      # Hold-to-reveal card with dynamic framer animations
    │   ├── GameScreen.jsx            # Synced timer, location reference grid, call vote
    │   ├── VotingScreen.jsx          # Live voting matrix & Spy last chance location guess
    │   ├── ResultsScreen.jsx         # Confetti victory, role reveal & replay loop
    │   └── SoundEffects.jsx          # Sound toggle & Web Audio API synthesized audio
    ├── data/
    │   └── locations.js              # 12+ detailed Bangladeshi location presets & roles
    └── lib/
        ├── firebase.js               # Firebase initialization & fallback offline helper
        └── gameEngine.js             # Room code gen, role distribution, timer calculations
```

---

## Progress Log

### Phase 1: Planning & Setup
- [x] Initialized `game.md` with complete architecture specifications, data model, and Bangladeshi locations list.
- [x] Initialized Next.js project dependencies and configuration files (`package.json`, `tailwind.config.js`, `next.config.js`).
- [x] Built core Firebase real-time integration layer (`src/lib/firebase.js`).

### Phase 2: Data & Core Logic
- [x] Created `src/data/locations.js` with all 12 Bangladeshi location presets & roles.
- [x] Created `src/lib/gameEngine.js` for room creation, code generation, secret role assignment logic.

### Phase 3: UI Components Implementation
- [x] Built `HomeScreen.jsx` with Bangladeshi theme, local storage session persistence, join/create forms.
- [x] Built `LobbyScreen.jsx` with real-time Firebase sync, room code display, duration selector.
- [x] Built `RoleRevealScreen.jsx` with smooth hold-to-reveal gestures.
- [x] Built `GameScreen.jsx` with synchronized live countdown, player status grid, locations list.
- [x] Built `VotingScreen.jsx` with vote submission and Chor location-guessing modal.
- [x] Built `ResultsScreen.jsx` with winner announcement, detailed stats, and play again loop.

### Phase 4: Polish, Audio & Verification
- [x] Implemented audio feedback (sound synthesizer for reveals & countdown).
- [x] Configured mobile responsiveness, viewport scaling, PWA readiness.
- [x] Installed all npm packages (`npm install`).

### Phase 5: Bug Fixes & Hardening
- [x] Fixed `firebase.js` offline detection — replaced fragile `includes("demo")` string check with proper regex URL validation (`/^https:\/\/.+\.(firebaseio\.com|firebasedatabase\.app)/`). Added `safeGet()` helper.
- [x] Fixed `page.jsx` — added `set` import (was crashing `handleJoinRoom` with ReferenceError).
- [x] Fixed `handleJoinRoom` — now fetches existing room from Firebase via `safeGet()` before adding the joining player, so all current players are visible immediately.
- [x] Added `handleLeaveRoom` — clears localStorage, resets state, removes player from Firebase. Passed to `LobbyScreen` as `onLeaveRoom` prop.
- [x] Fixed stale closure in voting auto-finalize — introduced `playerIdRef` so the Firebase `onValue` callback always reads the current `playerId`.
- [x] Fixed `handlePlayAgain` — now fully resets `hasVoted`, `voteFor`, `isSpy`, `role` for every player so stale round data doesn't bleed into the next game.
- [x] Replaced all raw `update(ref(...))` calls with `safeUpdate()` — no more crashes when Firebase is offline.
- [x] Improved `handleFinalizeVoting` — when spy is caught, sets `caughtSpyId` instead of jumping to results, letting the spy submit a final location guess.
- [x] Updated `VotingScreen.jsx` — handles `caughtSpyId` state: spy sees location-guess modal, citizens see waiting screen.
- [x] Fixed `SoundEffects.jsx` — removed unused `status` prop, added `aria-label`.
- [x] Added `favicon.ico` to `/public` (was 404 on every page load).
- [x] Updated `manifest.json` to include `logo.png` as a proper PWA icon.

---

## Instructions for Next Session / Other Account
When continuing work on another machine/account:
1. Open this workspace in Antigravity.
2. Read `game.md` to instantly get the context, complete feature requirements, data structure, and active progress state.
3. Check **Progress Log** above to resume from the latest pending task.
