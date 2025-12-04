# GameSessionId QR Code Integration - Quick Reference

## Summary of Changes

The QR code system has been updated to use `gameSessionId` (numeric) instead of `sessionCode` (alphanumeric) for player session joining.

### Files Modified

1. **`app/components/QRCodeDialog.tsx`**

   - Changed prop from `sessionCode: string` to `gameSessionId: number`
   - Updated QR code URL from `/player?session={sessionCode}` to `/playerlogin?sessionId={gameSessionId}`

2. **`app/facilitator-dashboard/page.tsx`**

   - Added state: `const [gameSessionId, setGameSessionId] = useState<number | null>(null)`
   - Added effect to extract `gameSessionId` from `dashboardData`
   - Updated QRCodeDialog prop to pass `gameSessionId`

3. **`app/facilitator-dashboard/[sessionCode]/page.tsx`**
   - Added state: `const [gameSessionId, setGameSessionId] = useState<number | null>(null)`
   - Added effect to extract `gameSessionId` from `dashboardData`
   - Updated QRCodeDialog prop to pass `gameSessionId`

### System Flow

```
Facilitator Dashboard
  ↓
  Fetches dashboard data (includes gameSessionId)
  ↓
  Extracts gameSessionId from response
  ↓
  Passes to QRCodeDialog component
  ↓
QRCodeDialog
  ↓
  Generates QR code with URL: /playerlogin?sessionId={gameSessionId}
  ↓
  Displays QR code and link for sharing
  ↓
Player Login
  ↓
  Reads sessionId from query params
  ↓
  Parses to number and stores in state
  ↓
  Passes to loginPlayer() on form submit
  ↓
Backend
  ↓
  Receives gameSessionId in player registration request
  ↓
  Associates player with correct game session
  ↓
  Returns player data with session context
```

### Data Structure

**From Backend Dashboard API:**

```json
{
  "gameSessionId": 1,
  "sessionCode": "SHI-HDS-XkkKi",
  "sessionUnlocked": true,
  ...
}
```

**QR Code URL Generated:**

```
https://yourdomain.com/playerlogin?sessionId=1
```

**Player Login Request Sent:**

```json
{
  "name": "Player Name",
  "email": "player@email.com",
  "language": "en",
  "gameSessionId": 1
}
```

## Testing

### Prerequisites

- Backend returns `gameSessionId` in dashboard response
- Backend player registration endpoint accepts `gameSessionId` parameter

### Test Steps

1. **Facilitator Unlocks Session**

   - Navigate to facilitator dashboard
   - Click "Unlock Session for Players"
   - Confirm unlock

2. **QR Code Generation**

   - Click "QR Code" button
   - Verify QR code displays
   - Check link field shows: `/playerlogin?sessionId=1` (or appropriate ID)

3. **Player Login via QR Code**

   - Scan QR code with mobile device
   - Should navigate to: `/playerlogin?sessionId=1`
   - Enter player details (name, email, language)
   - Click "Join Game"

4. **Session Association**
   - Player should successfully join the session
   - Player should appear in dashboard's player list
   - Player should see session-specific content

### Verification Points

- [ ] Dashboard data includes `gameSessionId` field
- [ ] QRCodeDialog receives numeric `gameSessionId` prop
- [ ] QR code URL contains `sessionId` query parameter with correct number
- [ ] Player login page parses `sessionId` from URL correctly
- [ ] Backend receives `gameSessionId` in player registration
- [ ] Player is associated with correct session

## Benefits

✅ **Type Safety** - Numeric IDs prevent parsing errors  
✅ **Simplicity** - Shorter, simpler QR codes  
✅ **Direct Mapping** - Direct association to database session ID  
✅ **Consistency** - Aligns with internal database structure  
✅ **Efficiency** - Numeric IDs are faster to query and index

## Related Files

- `app/lib/api/services/auth.ts` - Already handles `gameSessionId` parameter
- `app/playerlogin/page.tsx` - Already parses `sessionId` from query params
- `app/lib/hooks/useAuth.ts` - Already passes `gameSessionId` to backend
- `docs/GAMESESSIONID_QR_INTEGRATION.md` - Detailed integration documentation
