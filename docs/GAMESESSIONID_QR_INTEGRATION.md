# Game Session ID QR Code Integration

## Overview

This document outlines the implementation of using `gameSessionId` (numeric ID) instead of `sessionCode` (alphanumeric code) to generate QR codes for player session joining.

## Flow Diagram

```
Facilitator unlocks session
    ↓
Dashboard fetches session data (including gameSessionId)
    ↓
gameSessionId extracted from dashboardData
    ↓
QR Code displays: /playerlogin?sessionId={gameSessionId}
    ↓
Player scans QR code → Browser navigates to URL
    ↓
Player login page reads sessionId from query params
    ↓
Player fills form (name, email, language) and clicks "Join"
    ↓
Frontend calls: loginPlayer(name, email, language, gameSessionId)
    ↓
Backend associates player with session using gameSessionId
    ↓
Player joins correct session
```

## Changes Made

### 1. QRCodeDialog Component (`app/components/QRCodeDialog.tsx`)

**Changed:** Switched from `sessionCode` to `gameSessionId`

**Before:**

```typescript
interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  sessionCode: string;
}

export default function QRCodeModal({
  open,
  onClose,
  sessionCode,
}: QRCodeModalProps) {
  const [sessionUrl, setSessionUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionUrl(`${window.location.origin}/player?session=${sessionCode}`);
    }
  }, [sessionCode]);
```

**After:**

```typescript
interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  gameSessionId: number;
}

export default function QRCodeModal({
  open,
  onClose,
  gameSessionId,
}: QRCodeModalProps) {
  const [sessionUrl, setSessionUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionUrl(`${window.location.origin}/playerlogin?sessionId=${gameSessionId}`);
    }
  }, [gameSessionId]);
```

### 2. Facilitator Dashboard - Query String Version (`app/facilitator-dashboard/page.tsx`)

**Changed:** Extract gameSessionId from dashboardData and pass to QRCodeDialog

**Added state:**

```typescript
const [gameSessionId, setGameSessionId] = useState<number | null>(null);
```

**Updated dashboard data sync effect:**

```typescript
useEffect(() => {
  if (dashboardData?.sessionUnlocked === true) {
    setIsSessionUnlocked(true);
    start();
  }

  // Extract gameSessionId from dashboard data
  if (dashboardData?.gameSessionId) {
    setGameSessionId(dashboardData.gameSessionId);
  }
}, [dashboardData?.sessionUnlocked, dashboardData?.gameSessionId, start]);
```

**Updated QRCodeDialog prop:**

```typescript
<QRCodeDialog
  open={showQR}
  onClose={() => {
    setShowQR(false);
  }}
  gameSessionId={gameSessionId || 0}
/>
```

### 3. Facilitator Dashboard - Session Code Version (`app/facilitator-dashboard/[sessionCode]/page.tsx`)

**Changed:** Same changes as above for the session code variant

**Added state:**

```typescript
const [gameSessionId, setGameSessionId] = useState<number | null>(null);
```

**Updated dashboard data sync effect:**

```typescript
useEffect(() => {
  if (dashboardData?.sessionUnlocked === true) {
    setIsSessionUnlocked(true);
    start();
  }

  // Extract gameSessionId from dashboard data
  if (dashboardData?.gameSessionId) {
    setGameSessionId(dashboardData.gameSessionId);
  }
}, [dashboardData?.sessionUnlocked, dashboardData?.gameSessionId, start]);
```

**Updated QRCodeDialog prop:**

```typescript
<QRCodeDialog
  open={showQR}
  onClose={() => {
    setShowQR(false);
  }}
  gameSessionId={gameSessionId || 0}
/>
```

## Player Login Page Integration

The player login page (`app/playerlogin/page.tsx`) already has the correct implementation:

1. **Reads sessionId from query params:**

```typescript
useEffect(() => {
  const sessionId = searchParams?.get("sessionId");
  if (sessionId) {
    const parsedId = parseInt(sessionId, 10);
    if (!isNaN(parsedId)) {
      setGameSessionId(parsedId);
    }
  }
}, [searchParams]);
```

2. **Passes gameSessionId to login handler:**

```typescript
const result = await loginPlayer(
  name.trim(),
  email.trim(),
  language,
  gameSessionId
);
```

## API Integration

The auth service (`app/lib/api/services/auth.ts`) already handles gameSessionId correctly:

```typescript
loginPlayer: async (
  name: string,
  email: string,
  language: string,
  gameSessionId?: number | null
) => {
  return apiClient.post<Player>("/api/auth/player", {
    name,
    email,
    language,
    gameSessionId,
  });
};
```

## Backend Expectation

The backend API endpoint `/api/auth/player` should:

1. Accept `gameSessionId` in the request body
2. Use this ID to associate the new player with the correct game session
3. Return the player data with appropriate session context

## Example Flow

### Session Data from API

```json
{
  "gameSessionId": 1,
  "sessionCode": "SHI-HDS-XkkKi",
  "status": 1,
  "playerJoined": 1,
  "sessionUnlocked": true,
  "sessionStarted": "2025-11-11T00:00:00",
  "sessionDuration": 60,
  "sessionUnlockedAt": "2025-12-04T05:28:03.00968+00:00",
  "playerProgresses": null
}
```

### QR Code URL Generated

```
https://yourdomain.com/playerlogin?sessionId=1
```

### Player Login Flow

1. Player scans QR code
2. Browser navigates to `/playerlogin?sessionId=1`
3. Player login page parses `sessionId=1` from URL
4. Player enters name, email, and selects language
5. Click "Join Game"
6. Frontend calls backend with:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "language": "en",
     "gameSessionId": 1
   }
   ```
7. Backend creates player and associates with session ID 1
8. Player is now part of the game session

## Testing Checklist

- [ ] Dashboard data includes `gameSessionId` field
- [ ] Facilitator unlocks session
- [ ] QR Code dialog shows QR code with correct gameSessionId
- [ ] QR code URL displays in link field: `/playerlogin?sessionId={gameSessionId}`
- [ ] Player can copy the link
- [ ] Player can share the QR code
- [ ] Player scans QR code on mobile device
- [ ] Player login page receives correct sessionId in query params
- [ ] Player successfully joins the game session
- [ ] Player appears in session's player list on dashboard

## Benefits of This Approach

1. **Type Safety**: gameSessionId is a number, reducing parsing errors
2. **Simplicity**: Shorter, numeric-only QR codes
3. **Direct Association**: Direct mapping to game session in database
4. **Consistency**: Aligns with internal database IDs
5. **Scalability**: Numeric IDs are more efficient for large-scale systems
