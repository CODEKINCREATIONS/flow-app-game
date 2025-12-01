# Player Data Display - Troubleshooting Guide

## Issue: Players not showing in facilitator dashboard

### Quick Diagnosis

1. **Check if error message appears:**

   - Red box at top of PlayerProgress component = API error
   - Read the error message for details

2. **Check if loading spinner shows:**

   - Spinning circle + "Loading player data..." = normal, wait a moment

3. **Check if "No players joined yet" shows:**
   - This is normal if no players have joined the session yet

### Common Issues & Fixes

#### Issue 1: "Failed to fetch dashboard data"

**Cause:** Backend `/Dashboard/GetDashboard` endpoint not responding

**Fix:**

1. Verify session code is valid
2. Check backend is running
3. Check network in browser DevTools (F12 → Network tab)
4. Look for failed requests to `/api/dashboard/get-dashboard/`

#### Issue 2: "Network error occurred"

**Cause:** Client can't reach Next.js API layer

**Fix:**

1. Check internet connection
2. Check if app is deployed
3. Verify API_URL env var is correct: `NEXT_PUBLIC_API_URL`

#### Issue 3: Players show for a moment then disappear

**Cause:** Likely a state update issue in polling

**Fix:**

1. Check browser console for React warnings
2. Verify session is still active
3. Check if `Finish Session` wasn't clicked

#### Issue 4: Some players show, but not all

**Cause:** Partial response from backend or mapping issue

**Fix:**

1. Check Azure backend logs
2. Verify all player records have required fields
3. Check field names match mapping in `useDashboard.ts`

### Debug Steps

#### Step 1: Check API Response

In browser DevTools Console:

```javascript
// Fetch and check raw API response
const resp = await fetch("/api/dashboard/get-dashboard/ABC123");
const data = await resp.json();
console.log(data);
```

Expected response:

```json
{
  "success": true,
  "data": {
    "gameSession": { ... },
    "playersProgress": [
      { "playerId": "123", "playerName": "John", "solved": true, ... },
      ...
    ]
  }
}
```

#### Step 2: Check Hook State

Add this to PlayerProgress component temporarily:

```typescript
const { players, error, loading } = useDashboard();

useEffect(() => {
  console.log("Players:", players);
  console.log("Error:", error);
  console.log("Loading:", loading);
}, [players, error, loading]);
```

#### Step 3: Check Component Props

Add this to PlayerProgress component:

```typescript
useEffect(() => {
  console.log("SessionCode received:", sessionCode);
  console.log("Effective session code:", effectiveSessionCode);
}, [sessionCode, effectiveSessionCode]);
```

### Expected Behavior

**When players join:**

1. Component loads with spinner
2. Spinner disappears when data arrives
3. Table appears with player rows
4. Every 5 seconds, table updates with latest data

**When no players:**

1. Loading spinner shows briefly
2. Message "No players joined yet" appears
3. Polling continues in background

**On error:**

1. Red error box appears
2. Error message describes the issue
3. Polling continues, may retry and recover

### Key Files

| File                                                     | Purpose               | Related To            |
| -------------------------------------------------------- | --------------------- | --------------------- |
| `app/lib/hooks/useDashboard.ts`                          | Data fetching & state | Player data logic     |
| `app/components/PlayerProgress.tsx`                      | UI display            | What users see        |
| `app/api/dashboard/get-dashboard/[sessionCode]/route.ts` | Backend proxy         | API endpoint          |
| `app/api/game/players/route.ts`                          | Fallback endpoint     | Secondary data source |

### Network Requests Flow

```
Browser Request
  ↓
/api/dashboard/get-dashboard/{sessionCode}
  ↓ (Next.js API Route)
↓
Azure Backend
  ↓ (if 400 error, retry with query param)
↓
Response with players
  ↓
PlayerProgress component
  ↓
Display in table
```

### Performance Tips

- ✅ Polling every 5 seconds is normal
- ✅ API caching happens automatically
- ✅ Component re-renders only when data changes
- ✅ No memory leaks from polling (cleaned up on unmount)

### When to Escalate

Contact backend team if:

1. API endpoint returns 500 error
2. Response structure doesn't match expected format
3. Players data is missing from backend
4. Azure service is down

---

**Last Updated:** December 1, 2025
**For Issues:** Check PLAYER_DATA_FIX_SUMMARY.md for implementation details
