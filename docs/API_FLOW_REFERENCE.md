# API Flow & Expected Responses - Reference

## Overview

Complete reference of all API calls in the QR code → player join flow with expected request/response formats.

---

## 1️⃣ Dashboard Data API

### Request

```
GET /api/dashboard/get-dashboard?sessionCode=SHI-HDS-XkkKi
```

Or similar endpoint that returns session data.

### Expected Response (200 OK)

```json
{
  "success": true,
  "data": {
    "gameSession": {
      "gameSessionId": 1,
      "sessionCode": "SHI-HDS-XkkKi",
      "status": 1,
      "playerJoined": 0,
      "sessionUnlocked": false,
      "sessionStarted": "2025-11-11T00:00:00",
      "sessionDuration": 60,
      "sessionUnlockedAt": null,
      "playerProgresses": []
    },
    "playersProgress": []
  }
}
```

### ❌ If Fails

```json
{
  "success": false,
  "error": "Session not found"
}
```

### What Frontend Does

1. ✅ Checks `response.success === true`
2. ✅ Extracts `gameSessionId` from response
3. ✅ Stores in state: `setGameSessionId(1)`
4. ✅ Waits for facilitator to unlock session

---

## 2️⃣ Unlock Session API

### Request

```
POST /api/game/unlock-session
Body: {
  "sessionCode": "SHI-HDS-XkkKi"
}
```

### Expected Response (200 OK)

```json
{
  "success": true,
  "data": {
    "gameSessionId": 1,
    "sessionCode": "SHI-HDS-XkkKi",
    "sessionUnlocked": true,
    "sessionUnlockedAt": "2025-12-04T05:28:03.00968+00:00"
  }
}
```

### What Frontend Does

1. ✅ Shows success message
2. ✅ Sets `isSessionUnlocked = true`
3. ✅ Starts timer
4. ✅ Enables "QR Code" button

---

## 3️⃣ QR Code Dialog - URL Generation

### No API Call - Frontend Only

**Logic:**

```typescript
useEffect(() => {
  if (typeof window !== "undefined") {
    const url = `${window.location.origin}/playerlogin?sessionId=${gameSessionId}`;
    setSessionUrl(url);
  }
}, [gameSessionId]);
```

### Expected URL Generated

```
https://yourdomain.com/playerlogin?sessionId=1
```

### What Happens

1. ✅ QR code SVG is generated from this URL
2. ✅ URL is displayed in input field
3. ✅ URL can be copied
4. ✅ URL can be shared

---

## 4️⃣ Player Login Page - Query Parameter Parsing

### No API Call Yet - Frontend Only

**URL Player Navigates To:**

```
https://yourdomain.com/playerlogin?sessionId=1
```

**Logic:**

```typescript
useEffect(() => {
  const sessionId = searchParams?.get("sessionId"); // "1" (string)
  if (sessionId) {
    const parsedId = parseInt(sessionId, 10); // 1 (number)
    if (!isNaN(parsedId)) {
      setGameSessionId(parsedId);
    }
  }
}, [searchParams]);
```

### Expected State After Parse

```javascript
gameSessionId: 1; // number type
```

### What Happens

1. ✅ Player login form displays
2. ✅ sessionId is extracted and stored
3. ✅ sessionId will be included in join request

---

## 5️⃣ Player Join API - The Critical Call

### Request

```
POST /api/auth/player
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "language": "en",
  "gameSessionId": 1
}
```

### 🔴 IMPORTANT NOTES:

- ✅ `gameSessionId` MUST be included
- ✅ `gameSessionId` MUST be a number (not string)
- ✅ `gameSessionId` MUST match the QR code URL parameter
- ✅ `name` and `email` validation must pass first

### Expected Response (200 or 201)

```json
{
  "success": true,
  "data": {
    "id": "player-12345",
    "name": "John Doe",
    "email": "john@example.com",
    "language": "en",
    "gameSessionId": 1,
    "sessionCode": "SHI-HDS-XkkKi",
    "createdAt": "2025-12-04T10:30:00Z"
  }
}
```

### Backend Must Do:

1. ✅ Validate gameSessionId is provided
2. ✅ Find session with `gameSessionId = 1`
3. ✅ Verify session exists
4. ✅ Verify session is unlocked
5. ✅ Create new player record
6. ✅ Associate player with session
7. ✅ Return player data

### ❌ If Fails - 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid gameSessionId"
}
```

### ❌ If Fails - 404 Not Found

```json
{
  "success": false,
  "error": "Session not found"
}
```

### ❌ If Fails - 500 Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

### What Frontend Does After Success

1. ✅ Stores player data in auth state
2. ✅ Stores session info in context
3. ✅ Redirects to game page: `/Game-page`
4. ✅ Player can now see game content

---

## 6️⃣ Get Dashboard (Polling) - Verify Player Joined

### Request (Polled Every 5 Seconds)

```
GET /api/dashboard/get-dashboard?sessionCode=SHI-HDS-XkkKi
```

### Expected Response After Player Joins

```json
{
  "success": true,
  "data": {
    "gameSession": {
      "gameSessionId": 1,
      "sessionCode": "SHI-HDS-XkkKi",
      "sessionUnlocked": true,
      "playerJoined": 1
    },
    "playersProgress": [
      {
        "playerId": "player-12345",
        "playerName": "John Doe",
        "email": "john@example.com",
        "solved": false,
        "activeBox": 1
      }
    ]
  }
}
```

### What Facilitator Sees

1. ✅ Player count increases to 1
2. ✅ New player appears in player list
3. ✅ Player shows in correct session

---

## Complete Request/Response Chain

### Timeline:

```
T1: Facilitator Dashboard Loads
    Request: GET /api/dashboard/get-dashboard?sessionCode=SHI-HDS-XkkKi
    Response: { gameSessionId: 1, sessionUnlocked: false, ... }
    State: gameSessionId = 1

T2: Facilitator Unlocks Session
    Request: POST /api/game/unlock-session { sessionCode }
    Response: { sessionUnlocked: true, ... }
    State: isSessionUnlocked = true

T3: Facilitator Opens QR Code
    No API call
    URL Generated: /playerlogin?sessionId=1
    QR Code: Encoded from URL

T4: Player Scans QR Code
    Browser navigates to: /playerlogin?sessionId=1
    No API call yet
    State: gameSessionId = 1 (parsed from URL)

T5: Player Fills Form & Submits
    Request: POST /api/auth/player
    Body: { name, email, language, gameSessionId: 1 }
    Response: { success: true, data: { id, name, ... } }
    State: Player authenticated, redirect to game

T6: Dashboard Polling Updates
    Request: GET /api/dashboard/get-dashboard?sessionCode=...
    Response: { playerJoined: 1, playersProgress: [...] }
    Display: New player shown in list

T7: Player Joins Game Page
    Player can now see game content
    Player is part of Session 1
    Facilitator can see player in dashboard
```

---

## Validation Checklist

### Request Validation

**Player Join Request Must Have:**

- [ ] `name` - String, 2-50 characters
- [ ] `email` - Valid email format
- [ ] `language` - One of: "en", "pt", "fr" (or configured languages)
- [ ] `gameSessionId` - Number, positive integer

### Response Validation

**Success Response Must Have:**

- [ ] `success: true`
- [ ] `data` object with:
  - [ ] `id` - Player ID
  - [ ] `name` - Player name
  - [ ] `email` - Player email
  - [ ] `gameSessionId` - Must match request

**Error Response Must Have:**

- [ ] `success: false`
- [ ] `error` - Error message string

---

## Testing Each API Call

### Test Dashboard API

```bash
# PowerShell
$headers = @{"Content-Type"="application/json"}
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/dashboard/get-dashboard?sessionCode=SHI-HDS-XkkKi" -Headers $headers
$response.Content | ConvertFrom-Json
```

Expected: gameSessionId field visible

### Test Unlock API

```bash
$body = @{sessionCode="SHI-HDS-XkkKi"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/game/unlock-session" -Method POST -Headers $headers -Body $body
$response.Content | ConvertFrom-Json
```

Expected: sessionUnlocked = true

### Test Player Join API

```bash
$body = @{
  name="Test Player"
  email="test@example.com"
  language="en"
  gameSessionId=1
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/player" -Method POST -Headers $headers -Body $body
$response.Content | ConvertFrom-Json
```

Expected: success = true, data object with player info

---

## Common API Issues

| Issue                       | Cause                      | Solution                             |
| --------------------------- | -------------------------- | ------------------------------------ |
| gameSessionId is undefined  | Dashboard didn't return it | Check dashboard API response         |
| gameSessionId is null       | Dashboard returned null    | Backend needs to provide it          |
| gameSessionId is string "1" | Parsed as string in URL    | Frontend should parseInt()           |
| Session not found           | Wrong gameSessionId sent   | Verify gameSessionId matches session |
| Player not created          | Backend error              | Check backend logs                   |
| Player in wrong session     | Backend logic error        | Backend to fix association logic     |

---

## Success Indicators

✅ **All APIs return 200/201 status**  
✅ **Each response includes success: true**  
✅ **gameSessionId consistent across all calls**  
✅ **Player appears in facilitator's player list**  
✅ **No errors in browser console**  
✅ **Facilitator and player see same session**

---

**For Facilitator Testing:** `docs/QUICK_TEST_CHECKLIST.md`  
**For Detailed Testing:** `docs/TESTING_GUIDE.md`  
**For DevTools Usage:** `docs/DEVTOOLS_TESTING_GUIDE.md`
