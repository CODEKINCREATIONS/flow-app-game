# Quick Reference - Player Activity API with Numeric Index

## 🎯 The Problem

Your local system uses string player IDs: `player-0.014879969749047928`  
Your external API expects numeric IDs: `1`, `2`, `3`

## ✅ The Solution

Use **player position index** (1-based) instead of player ID string

---

## 📍 API Endpoint Behavior

### Client Endpoint (Your Proxy)

```
GET http://localhost:3000/api/game/player-activity?sessionCode=SHI-HDS-XkkKi&playerId=1
```

### External API Endpoint

```
GET https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/1
```

### Transformation

```
Proxy Route Converts:
  ?playerId=1
  ↓
  /GetPlayerActivity/SHI-HDS-XkkKi/1
```

---

## 🔢 Index Examples

**Dashboard shows 3 players:**

```
Row 1: John (index 0 in array) → playerId sent to API = 1
Row 2: Sarah (index 1 in array) → playerId sent to API = 2
Row 3: Mike (index 2 in array) → playerId sent to API = 3
```

**When you click "View" on Row 2 (Sarah):**

```
map index = 1
Numeric playerId = 1 + 1 = 2
API call: /GetPlayerActivity/SHI-HDS-XkkKi/2
External API returns Sarah's stats
```

---

## 📊 Expected API Response

```json
{
  "playerStats": {
    "playerName": "Wahab",
    "boxesSolved": 1,
    "boxesVisited": 2,
    "totalBoxes": 3
  },
  "playersProgress": [
    {
      "playerName": "Wahab",
      "activeBox": 1,
      "attempt": 1,
      "solved": "Yes"
    }
  ]
}
```

---

## 🧪 Test with cURL

**Test your proxy endpoint:**

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/game/player-activity?sessionCode=SHI-HDS-XkkKi&playerId=1" -Method GET -Headers @{"Content-Type"="application/json"}
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected output:**

```json
{
  "playerStats": {
    "playerName": "Wahab",
    "boxesSolved": 1,
    "boxesVisited": 2,
    "totalBoxes": 3
  },
  "playersProgress": [ ... ]
}
```

---

## 🔗 Code Changes Summary

| File                                    | Change                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `PlayerProgress.tsx`                    | Track player index (0-based), convert to 1-based when passing to dialog |
| `PlayerDetailsDialog.tsx`               | Already receives numeric playerId, passes to getPlayerActivity          |
| `game.ts`                               | Already calls `/api/game/player-activity?...&playerId={numeric}`        |
| `app/api/game/player-activity/route.ts` | Converts `playerId` query param to external API URL path                |

---

## 🎯 Testing Checklist

```
[ ] Start dev server: npm run dev
[ ] Navigate to facilitator dashboard
[ ] Click "View" on first player
[ ] Check console: should show playerId=1
[ ] Check network: /api/game/player-activity?...&playerId=1
[ ] Check server logs: [Player Activity API] Proxying request to: .../GetPlayerActivity/.../1
[ ] Dialog should show real statistics (not zeros)
[ ] Close and try another player (should be playerId=2, playerId=3, etc.)
```

---

## 💡 Key Points

✅ **Player Index = array position + 1**  
✅ **First player → index 0 → playerId 1**  
✅ **Second player → index 1 → playerId 2**  
✅ **Numeric, not string IDs**  
✅ **Proxy handles the conversion to external API URL**

---

## 🚀 Ready to Test!

Your proxy is set up at: `app/api/game/player-activity/route.ts`  
Just click "View" on a player and watch the console!
