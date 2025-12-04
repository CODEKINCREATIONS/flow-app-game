# GameSessionId QR Code Flow - Visual Guide

## Architecture Diagram

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                   FACILITATOR DASHBOARD                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  1. Load Dashboard                                           ┃
┃     useDashboard.fetchDashboard(sessionCode)                ┃
┃                                                              ┃
┃  2. Backend Returns:                                         ┃
┃     {                                                        ┃
┃       gameSessionId: 1,           ← KEY FIELD               ┃
┃       sessionCode: "SHI-HDS-XkkKi",                          ┃
┃       sessionUnlocked: false,                                ┃
┃       ...                                                    ┃
┃     }                                                        ┃
┃                                                              ┃
┃  3. Unlock Session                                           ┃
┃     gameService.unlockSession(sessionCode)                  ┃
┃                                                              ┃
┃  4. Dashboard Data Updates:                                  ┃
┃     {                                                        ┃
┃       gameSessionId: 1,                                      ┃
┃       sessionUnlocked: true       ← UNLOCKED                ┃
┃     }                                                        ┃
┃                                                              ┃
┃  5. Extract gameSessionId                                    ┃
┃     useEffect(() => {                                        ┃
┃       if (dashboardData?.gameSessionId) {                   ┃
┃         setGameSessionId(dashboardData.gameSessionId);      ┃
┃       }                                                      ┃
┃     }, [dashboardData?.gameSessionId])                      ┃
┃                                                              ┃
┃  6. Click QR Code Button                                     ┃
┃     → Show QRCodeDialog with gameSessionId={1}              ┃
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
                            │
                            │ gameSessionId={1}
                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    QR CODE DIALOG                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  interface QRCodeModalProps {                               ┃
┃    open: boolean;                                            ┃
┃    onClose: () => void;                                      ┃
┃    gameSessionId: number;  ← Changed from sessionCode       ┃
┃  }                                                           ┃
┃                                                              ┃
┃  useEffect(() => {                                           ┃
┃    const url = `${window.location.origin}/playerlogin       ┃
┃                 ?sessionId=${gameSessionId}`;                ┃
┃    setSessionUrl(url);                                       ┃
┃  }, [gameSessionId]);                                        ┃
┃                                                              ┃
┃  Example URL Generated:                                      ┃
┃  ┌──────────────────────────────────────────────────┐       ┃
┃  │ https://yourdomain.com/playerlogin?sessionId=1  │       ┃
┃  └──────────────────────────────────────────────────┘       ┃
┃                                                              ┃
┃  Display:                                                    ┃
┃  ┌──────────────────────────────────────┐                   ┃
┃  │  ██████████████████████████████████  │                   ┃
┃  │  ██                              ██  │    QR Code       ┃
┃  │  ██  [QR CODE IMAGE]             ██  │                   ┃
┃  │  ██                              ██  │                   ┃
┃  │  ██████████████████████████████████  │                   ┃
┃  └──────────────────────────────────────┘                   ┃
┃  ┌──────────────────────────────────────┐                   ┃
┃  │ https://yourdomain.com/playerlogin   │                   ┃
┃  │ ?sessionId=1                    [📋] │ Copy Link       ┃
┃  └──────────────────────────────────────┘                   ┃
┃  [Share QR Code] Button                                      ┃
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
                            │
                            │ Player scans QR code
                            │ or clicks link
                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                  MOBILE BROWSER / PLAYER DEVICE              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  URL Bar: /playerlogin?sessionId=1                           ┃
┃                                                              ┃
┃  Navigation:                                                 ┃
┃  window.location.href =                                      ┃
┃    "https://yourdomain.com/playerlogin?sessionId=1"         ┃
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
                            │
                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                  PLAYER LOGIN PAGE                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  Page Loads: /playerlogin?sessionId=1                        ┃
┃                                                              ┃
┃  useSearchParams() Parsing:                                  ┃
┃  const searchParams = useSearchParams();                    ┃
┃  const sessionId = searchParams?.get("sessionId");  → "1"  ┃
┃                                                              ┃
┃  useEffect(() => {                                           ┃
┃    if (sessionId) {                                          ┃
┃      const parsedId = parseInt(sessionId, 10);              ┃
┃      if (!isNaN(parsedId)) {                                ┃
┃        setGameSessionId(parsedId);  → 1 (number)            ┃
┃      }                                                       ┃
┃    }                                                         ┃
┃  }, [searchParams]);                                         ┃
┃                                                              ┃
┃  Form Display:                                               ┃
┃  ┌────────────────────────────────────┐                     ┃
┃  │  Enter your details                │                     ┃
┃  │                                    │                     ┃
┃  │  Name: [___________________]       │                     ┃
┃  │  Email: [__________________]       │                     ┃
┃  │  Language: [EN ▼]                  │                     ┃
┃  │                                    │                     ┃
┃  │  [    Join Game    ]               │                     ┃
┃  └────────────────────────────────────┘                     ┃
┃                                                              ┃
┃  Player Submits Form                                         ┃
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
                            │
                            │ loginPlayer(
                            │   name: "John",
                            │   email: "john@example.com",
                            │   language: "en",
                            │   gameSessionId: 1
                            │ )
                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    AUTH HOOK                                 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  handlePlayerLogin() called with all 4 parameters           ┃
┃                                                              ┃
┃  Calls authService.loginPlayer(                             ┃
┃    "John",                                                   ┃
┃    "john@example.com",                                       ┃
┃    "en",                                                     ┃
┃    1                  ← gameSessionId passed to API         ┃
┃  )                                                           ┃
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
                            │
                            │ HTTP POST /api/auth/player
                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                   BACKEND API                                ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  Request Body:                                               ┃
┃  {                                                           ┃
┃    "name": "John",                                            ┃
┃    "email": "john@example.com",                              ┃
┃    "language": "en",                                         ┃
┃    "gameSessionId": 1              ← CRITICAL FIELD         ┃
┃  }                                                           ┃
┃                                                              ┃
┃  Backend Processing:                                         ┃
┃  1. Validate input                                           ┃
┃  2. Find session by gameSessionId (ID: 1)                   ┃
┃  3. Create new player record                                ┃
┃  4. Associate player with session                           ┃
┃  5. Store in database                                        ┃
┃                                                              ┃
┃  Response:                                                   ┃
┃  {                                                           ┃
┃    "success": true,                                          ┃
┃    "data": {                                                 ┃
┃      "id": "player-123",                                     ┃
┃      "name": "John",                                         ┃
┃      "email": "john@example.com",                            ┃
┃      "gameSessionId": 1,                                     ┃
┃      "language": "en"                                        ┃
┃    }                                                         ┃
┃  }                                                           ┃
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
                            │
                            │ Player data stored
                            │ in session context
                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                   GAME PAGE                                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  Player Successfully Joined Session 1                        ┃
┃                                                              ┃
┃  User can:                                                   ┃
┃  ✓ See other players in session                             ┃
┃  ✓ View session-specific content                            ┃
┃  ✓ Participate in game activities                           ┃
┃  ✓ Be shown in facilitator's player list                    ┃
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
                            │
                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                  FACILITATOR DASHBOARD                       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                              ┃
┃  Dashboard polling updates:                                  ┃
┃                                                              ┃
┃  Player List:                                                ┃
┃  ┌──────────────────────────────┐                           ┃
┃  │ Players (2)                  │                           ┃
┃  ├──────────────────────────────┤                           ┃
┃  │ 1. John (john@example.com)   │ ← NEW PLAYER              ┃
┃  │    Status: Active            │                           ┃
┃  │                              │                           ┃
┃  │ 2. Jane (jane@example.com)   │                           ┃
┃  │    Status: Active            │                           ┃
┃  └──────────────────────────────┘                           ┃
┃                                                              ┃
│  Player joined correct session using gameSessionId!         │
┃                                                              ┃
└━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Facilitator Dashboard State                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ const [gameSessionId, setGameSessionId] = useState(null);   │
│                                                              │
│ useEffect(() => {                                           │
│   if (dashboardData?.gameSessionId) {                       │
│     setGameSessionId(dashboardData.gameSessionId);          │
│     ↓                                                        │
│     Trigger render with gameSessionId={1}                   │
│   }                                                          │
│ }, [dashboardData?.gameSessionId])                          │
│                                                              │
│ Rendered: <QRCodeDialog gameSessionId={1} />               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## URL Query Parameter Flow

```
QR Code Generated:
https://yourdomain.com/playerlogin?sessionId=1
                                    ↓
Player Scans/Clicks:
Browser navigates to: /playerlogin?sessionId=1
                                    ↓
Player Login Page Loads:
useSearchParams() → {sessionId: "1"}
                                    ↓
Parse to Number:
parseInt("1", 10) → 1 (number)
                                    ↓
Store in State:
setGameSessionId(1)
                                    ↓
Submit Form:
loginPlayer(name, email, language, 1)
                                    ↓
Backend Request:
POST /api/auth/player
Body: { name, email, language, gameSessionId: 1 }
```

## Key Changes Summary

| Component            | Before                   | After                         |
| -------------------- | ------------------------ | ----------------------------- |
| **QRCodeDialog**     | `sessionCode: string`    | `gameSessionId: number`       |
| **QR Code URL**      | `/player?session={code}` | `/playerlogin?sessionId={id}` |
| **Dashboard Effect** | Extract sessionCode      | Extract gameSessionId         |
| **Query Param**      | N/A (direct route)       | `sessionId=1` in URL          |

## Implementation Hierarchy

```
Level 1: Facilitator Dashboard
  ├─ Fetch dashboard data
  └─ Extract gameSessionId

Level 2: QR Code Dialog
  ├─ Receive gameSessionId prop
  └─ Generate URL with sessionId parameter

Level 3: Player Mobile Device
  ├─ Scan QR code
  └─ Navigate to URL

Level 4: Player Login Page
  ├─ Read sessionId from URL
  ├─ Parse to number
  └─ Pass to authentication

Level 5: Backend API
  ├─ Receive gameSessionId
  ├─ Find session by ID
  ├─ Create player
  └─ Associate with session
```

---

**Visual Guide for:** GameSessionId QR Code Integration  
**Created:** December 4, 2025  
**Status:** Reference Material
