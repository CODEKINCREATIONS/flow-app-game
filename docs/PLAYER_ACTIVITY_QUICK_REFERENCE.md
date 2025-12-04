# Player Activity API - Quick Reference

## 🎯 What Was Done

Integrated the Player Activity API into the PlayerDetailsDialog so that real player statistics display when facilitators click "View" on a player.

---

## 📍 Key Files

| File                                     | Purpose                                   |
| ---------------------------------------- | ----------------------------------------- |
| `app/api/game/player-activity/route.ts`  | Proxy endpoint (NEW)                      |
| `app/types/game.ts`                      | PlayerActivityData types (UPDATED)        |
| `app/lib/api/services/game.ts`           | gameService.getPlayerActivity() (UPDATED) |
| `app/components/PlayerDetailsDialog.tsx` | Dialog with API integration (UPDATED)     |
| `app/components/PlayerProgress.tsx`      | Pass props to dialog (UPDATED)            |

---

## 🔗 API Endpoint

**Proxy Route:**

```
GET /api/game/player-activity?sessionCode={sessionCode}&playerId={playerId}
```

**External API (called by proxy):**

```
{EXTERNAL_API_URL}/PlayerProgress/GetPlayerActivity/{sessionCode}/{playerId}
```

**Example:**

```
https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/1
```

---

## 📊 Statistics Display

**Before API Integration:**

```
Demo Data Only
├── Boxes Solved: 2 (hardcoded)
├── Boxes Visited: 3 (hardcoded)
└── Total Boxes: 5 (hardcoded)
```

**After API Integration:**

```
Real API Data
├── Boxes Solved: 1 (from playerStats.boxesSolved)
├── Boxes Visited: 2 (from playerStats.boxesVisited)
└── Total Boxes: 3 (from playerStats.totalBoxes)
```

---

## 🚦 Dialog State Flow

```
Dialog Opens
    ↓
[isLoading = true, shows spinner]
    ↓
API Call Made
    ↓
Success: [isLoading = false, show statistics]
Error: [show error message]
    ↓
Statistics Display:
├── Real API data (if available)
└── Demo data (if API fails)
```

---

## 🐛 Console Logs

When you click "View" on a player and the dialog opens, you'll see:

```javascript
// From PlayerDetailsDialog component
[PlayerDetailsDialog] Fetching activity for player 1 in session SHI-HDS-XkkKi

// From Proxy Route
[Player Activity API] Proxying request to: https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/PlayerProgress/GetPlayerActivity/SHI-HDS-XkkKi/1
[Player Activity API] Response: {playerStats: {...}, playersProgress: [...]}

// From PlayerDetailsDialog component
[PlayerDetailsDialog] Activity data received: {playerStats: {...}, playersProgress: [...]}
```

---

## ⚡ Usage Example

```typescript
// In any component
import { gameService } from "@/app/lib/api/services/game";

const response = await gameService.getPlayerActivity(
  sessionCode, // "SHI-HDS-XkkKi"
  playerId // 1
);

if (response.success) {
  console.log(response.data.playerStats);
  // Output: { playerName: "Wahab", boxesSolved: 1, boxesVisited: 2, totalBoxes: 3 }
}
```

---

## ✅ Testing Checklist

- [ ] Run `npm run dev`
- [ ] Navigate to facilitator dashboard
- [ ] Click "View" on a player
- [ ] Verify dialog opens with loading spinner
- [ ] Check browser console for API logs
- [ ] Verify statistics display real data
- [ ] Test error handling (disconnect network)
- [ ] Verify fallback to demo data on error

---

## 🔗 Data Type Definitions

**PlayerStats**

```typescript
{
  playerName: "Wahab",
  boxesSolved: 1,
  boxesVisited: 2,
  totalBoxes: 3
}
```

**PlayerActivityItem**

```typescript
{
  playerName: "Wahab",
  activeBox: 1,
  attempt: 1,
  solved: "Yes" // "Yes" | "No" | string
}
```

**PlayerActivityData** (Complete Response)

```typescript
{
  playerStats: PlayerStats,
  playersProgress: PlayerActivityItem[]
}
```

---

## 🎨 UI States

### Loading State

- Spinner animation
- Text: "Loading player data..."
- Statistics hidden

### Error State

- Red error box
- Error message displayed
- Statistics fallback to demo data

### Success State

- Statistics show real API data
- Cards display with color coding
- Activity list populated

---

## 🚨 Common Issues

**Q: Statistics show zeros**

- A: API might be returning null, check response format

**Q: API call fails silently**

- A: Check browser DevTools Console for error logs

**Q: Dialog doesn't open**

- A: Check if sessionCode and playerId are passed correctly from PlayerProgress

**Q: Spinner shows forever**

- A: API might be timing out, check network tab

---

## 📞 Support

If you need to modify the implementation:

1. **Change statistics labels** → Edit `PlayerDetailsDialog.tsx` (search for "Boxes Solved")
2. **Modify API endpoint** → Edit `app/api/game/player-activity/route.ts`
3. **Add caching** → Wrap API call with cache logic
4. **Add polling** → Add setInterval around API call

---

**Created:** December 3, 2025  
**Status:** ✅ Ready for Testing
