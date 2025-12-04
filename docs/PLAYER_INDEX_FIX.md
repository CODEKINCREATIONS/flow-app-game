# Player Activity API Integration - Numeric Index Fix

## 🎯 Problem & Solution

**Problem:**

- Local player IDs are strings like `player-0.014879969749047928`
- External API expects numeric IDs like `1`, `2`, `3`, etc.
- The API endpoint requires: `/PlayerProgress/GetPlayerActivity/{sessionCode}/{playerId}`

**Solution:**

- Calculate player index based on position in the players array
- Pass numeric index (1, 2, 3...) to the proxy API
- Proxy converts: `playerId=1` → `/PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/1`

---

## 🔄 Data Flow

```
Player List
├── Player 1 (playerId: "player-0.014...")
├── Player 2 (playerId: "player-0.234...")
└── Player 3 (playerId: "player-0.456...")
    ↓
Click "View" on Player 2 (index 1)
    ↓
Calculate numeric index: index + 1 = 2
    ↓
Pass playerId={2} to PlayerDetailsDialog
    ↓
Call getPlayerActivity(sessionCode, 2)
    ↓
Proxy route constructs URL:
{SESSION_VERIFICATION_URL}/PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/2
    ↓
External API returns stats for player #2
```

---

## 📝 Changes Made

### 1. PlayerProgress Component

```tsx
// Added selectedPlayerIndex state
const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);

// Updated handleViewPlayer to track index
const handleViewPlayer = (player: any, index: number) => {
  setSelectedPlayer(player);
  setSelectedPlayerIndex(index + 1); // 1-based index
  setShowDetailsDialog(true);
};

// Updated map function
displayPlayers.map((p: any, index: number) => (
  <Button onClick={() => handleViewPlayer(p, index)}>View</Button>
))

// Pass numeric index to dialog
<PlayerDetailsDialog
  playerId={selectedPlayerIndex}  // Now numeric: 1, 2, 3...
  sessionCode={effectiveSessionCode}
  // ...
/>
```

### 2. PlayerDetailsDialog Component

- Already accepts `playerId?: number | string`
- Calls `getPlayerActivity(sessionCode, playerId)` with numeric index
- Works seamlessly with proxy route

### 3. Game Service

```tsx
getPlayerActivity: async (sessionCode: string, playerId: number | string) => {
  return apiClient.get<PlayerActivityData>(
    `/api/game/player-activity?sessionCode=${sessionCode}&playerId=${playerId}`
  );
};
```

### 4. Proxy Route (`/api/game/player-activity`)

```tsx
const externalApiUrl = `${env.SESSION_VERIFICATION_URL}/PlayerProgress/GetPlayerActivity/${sessionCode}/${playerId}`;
// Becomes: .../PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/1
```

---

## 🧪 Testing Steps

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Navigate to Dashboard

1. Go to `http://localhost:3000/facilitator-dashboard`
2. Login with session code: `SHI-HDS-XkkKi`

### Step 3: View Player Details

1. Scroll to "Player Progress" table
2. You should see multiple players listed
3. Click "View" button on the **first player**

### Step 4: Check Console Logs

Open DevTools Console (F12) and look for:

```
[PlayerDetailsDialog] Fetching activity for player 1 in session SHI-HDS-XkkKi
```

### Step 5: Check Network Tab

Go to **Network** tab and look for:

- Request to `/api/game/player-activity?sessionCode=SHI-HDS-XkkKi&playerId=1`

### Step 6: Check Server Logs

In terminal, you should see:

```
[Player Activity API] Proxying request to: https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/1
```

### Step 7: Verify Response

Console should show:

```
[PlayerDetailsDialog] Activity data received: {
  playerStats: {
    playerName: "Wahab",
    boxesSolved: 1,
    boxesVisited: 2,
    totalBoxes: 3
  },
  playersProgress: [...]
}
```

### Step 8: Check Statistics Display

Dialog should show real values:

- **Boxes Solved**: 1
- **Boxes Visited**: 2
- **Total Boxes**: 3

---

## 🎯 Player Index Examples

| Action                     | Index | playerId Sent | External API URL              |
| -------------------------- | ----- | ------------- | ----------------------------- |
| Click "View" on 1st player | 0     | 1             | `.../GetPlayerActivity/.../1` |
| Click "View" on 2nd player | 1     | 2             | `.../GetPlayerActivity/.../2` |
| Click "View" on 3rd player | 2     | 3             | `.../GetPlayerActivity/.../3` |

---

## 🔗 API Endpoint Mapping

```
Client Request:
  GET /api/game/player-activity?sessionCode=SHI-HDS-XkkKi&playerId=1

Proxy Route Transforms To:
  GET https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/1

Response:
  {
    "playerStats": {
      "playerName": "Wahab",
      "boxesSolved": 1,
      "boxesVisited": 2,
      "totalBoxes": 3
    },
    "playersProgress": [...]
  }
```

---

## ✅ Checklist

- [x] PlayerProgress tracks player index (0-based)
- [x] Converts to 1-based for API (index + 1)
- [x] Passes numeric playerId to dialog
- [x] PlayerDetailsDialog sends numeric playerId to API
- [x] Game service passes playerId to proxy route
- [x] Proxy route converts to external API URL
- [x] External API receives numeric player ID (1, 2, 3...)
- [x] Statistics display real data from API

---

## 🐛 Debugging

**Issue: API returns 404**

- ❌ Verify the player index is being calculated correctly (should be 1, 2, 3...)
- ❌ Check network tab to see what `playerId` is being sent
- ✅ Should be numeric: `playerId=1` not `playerId=player-0.123...`

**Issue: Dialog shows loading forever**

- ❌ Check external API is accessible: curl the external endpoint directly
- ❌ Verify SESSION_VERIFICATION_URL env is correct
- ✅ Check server logs for proxy error messages

**Issue: Statistics show zeros**

- ❌ API might be returning null/undefined fields
- ✅ Check the API response structure matches expected format

**Issue: Wrong player data displayed**

- ❌ Verify you clicked on the correct player row
- ❌ Check the index calculation (should be +1 from map index)
- ✅ Console should show correct playerId being sent

---

## 📊 Data Structure

**playerStats** (Real API Data):

```json
{
  "playerName": "Wahab",
  "boxesSolved": 1,
  "boxesVisited": 2,
  "totalBoxes": 3
}
```

**playersProgress** (Additional context):

```json
[
  {
    "playerName": "Wahab",
    "activeBox": 1,
    "attempt": 1,
    "solved": "Yes"
  }
]
```

---

## 🎓 How Index Calculation Works

```tsx
// PlayerProgress component
displayPlayers.map((p: any, index: number) => {
  // index: 0, 1, 2... (0-based from map)

  onClick={() => handleViewPlayer(p, index)}
  // index passed to handler

  const handleViewPlayer = (player: any, index: number) => {
    setSelectedPlayerIndex(index + 1); // Convert to 1-based: 1, 2, 3...
  };

  // PlayerDetailsDialog receives playerId={1}
  // Proxy route gets playerId=1 from query params
  // External API called: /GetPlayerActivity/.../1
})
```

---

## 🚀 API Proxy Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  PlayerDetailsDialog clicks "View" on 2nd player (index 1)  │
│                     ↓                                        │
│          setSelectedPlayerIndex(1 + 1 = 2)                  │
│                     ↓                                        │
│   gameService.getPlayerActivity(sessionCode, playerId=2)   │
│                     ↓                                        │
└────────────────────┼──────────────────────────────────────┘
                     │
┌────────────────────┼──────────────────────────────────────┐
│                    ↓                                       │
│            Next.js Server                                  │
│   GET /api/game/player-activity?sessionCode=XXX&playerId=2│
│                    ↓                                       │
│         route.ts handler processes                         │
│    externalApiUrl = `.../GetPlayerActivity/XXX/2`         │
│                    ↓                                       │
│    console.log("[Player Activity API] Proxying...")       │
│                    ↓                                       │
└────────────────────┼──────────────────────────────────────┘
                     │
┌────────────────────┼──────────────────────────────────────┐
│                    ↓                                       │
│         External API (Azure)                              │
│   GET /PlayerProgress/GetPlayerActivity/SHI-HDS.../2     │
│                    ↓                                       │
│         Returns: playerStats, playersProgress             │
│                    ↓                                       │
└────────────────────┼──────────────────────────────────────┘
                     │
┌────────────────────┼──────────────────────────────────────┐
│                    ↓                                       │
│        Next.js Server Response                            │
│   { playerStats: {...}, playersProgress: [...] }         │
│                    ↓                                       │
│            Sent back to browser                           │
│                    ↓                                       │
└────────────────────┼──────────────────────────────────────┘
                     │
┌────────────────────┼──────────────────────────────────────┐
│                    ↓                                       │
│    Browser (Client) receives response                      │
│    setPlayerStats(data.playerStats)                        │
│    Dialog displays real statistics                         │
│         ✅ Success!                                        │
│                                                           │
└────────────────────────────────────────────────────────────┘
```

---

**Status:** ✅ Ready to Test  
**Last Updated:** December 3, 2025
