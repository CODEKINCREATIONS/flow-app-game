# Flow App Game - Architecture Documentation

## 📁 Project Structure

```
flow-app-game/
├── app/
│   ├── api/                      # API Routes (Next.js server routes)
│   ├── components/               # React Components
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts         # Barrel exports
│   │   └── ...                   # Feature-specific components
│   ├── lib/                      # Application Logic
│   │   ├── api/                  # API Service Layer
│   │   │   ├── client.ts        # API client configuration
│   │   │   └── services/         # Service modules
│   │   │       ├── auth.ts
│   │   │       ├── sessions.ts
│   │   │       └── game.ts
│   │   ├── store/                # Zustand State Management
│   │   │   ├── authStore.ts
│   │   │   ├── sessionStore.ts
│   │   │   └── gameStore.ts
│   │   ├── hooks/                # Custom React Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useSession.ts
│   │   │   ├── useGame.ts
│   │   │   └── useTimer.ts
│   │   ├── utils/                # Utility Functions
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   └── config/               # Configuration
│   │       └── env.ts
│   ├── types/                    # TypeScript Type Definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── game.ts
│   │   ├── session.ts
│   │   └── index.ts             # Type re-exports
│   └── ...                       # Page components
├── public/                       # Static assets
└── docs/                        # Documentation
```

## 🎯 State Management with Zustand

### Stores

#### 1. **AuthStore** (`app/lib/store/authStore.ts`)

Manages authentication state and user information.

**State:**

- `user`: Current user (Player or Facilitator)
- `role`: User role ('player' | 'facilitator')
- `isAuthenticated`: Boolean authentication status

**Actions:**

- `loginPlayer(player)`: Login as player
- `loginFacilitator(facilitator)`: Login as facilitator
- `logout()`: Clear authentication
- `setUser(user)`: Update user

#### 2. **SessionStore** (`app/lib/store/sessionStore.ts`)

Manages game session state.

**State:**

- `session`: Current session object
- `sessionDetails`: Session details for dashboard
- `loading`: Loading state
- `error`: Error messages

**Actions:**

- `setSession(session)`: Set current session
- `addPlayer(player)`: Add player to session
- `removePlayer(playerId)`: Remove player
- `updateSessionStatus(status)`: Update session status
- `reset()`: Reset store

#### 3. **GameStore** (`app/lib/store/gameStore.ts`)

Manages game state (chests, progress).

**State:**

- `chests`: Array of chest objects
- `currentChest`: Currently selected chest
- `playerProgress`: Player progress data
- `videoUrl`: Current video URL

**Actions:**

- `setChests(chests)`: Set chests
- `unlockChest(id, playerId, code)`: Unlock a chest
- `openChest(id)`: Open a chest
- `setPlayerProgress(progress)`: Set progress
- `reset()`: Reset game state

## 🔧 Custom Hooks

### `useAuth()` - Authentication Hook

```typescript
const { user, role, isAuthenticated, loginPlayer, loginFacilitator, logout } =
  useAuth();
```

### `useSession()` - Session Management Hook

```typescript
const { session, loading, fetchSession, joinSession, endSession } =
  useSession();
```

### `useGame()` - Game State Hook

```typescript
const { chests, unlockChest, fetchChests, playerProgress } = useGame();
```

### `useTimer()` - Timer Hook

```typescript
const { time, formatted, start, pause, reset } = useTimer({ autoStart: true });
```

## 🌐 API Services

### Service Layer Pattern

All API calls are abstracted through service modules:

```typescript
// app/lib/api/services/auth.ts
export const authService = {
  loginFacilitator: async (code: string) => {...},
  loginPlayer: async (name, email, language) => {...},
  logout: async () => {...}
}
```

### Usage in Components

```typescript
import { authService } from "@/app/lib/api/services/auth";

const result = await authService.loginFacilitator(code);
```

## 📝 Type Definitions

All types are centralized in `app/types/`:

- `auth.ts` - Authentication types
- `session.ts` - Session types
- `game.ts` - Game-related types
- `api.ts` - API response types

## 🎨 Component Organization

### UI Components (`app/components/ui/`)

Reusable, presentational components:

- Button, Card, Input, Modal, etc.

### Feature Components

Components specific to features:

- Header, SessionDetails, PlayerProgress, etc.

### Barrel Exports

Use `index.ts` for clean imports:

```typescript
// Before
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";

// After
import { Button, Card } from "@/app/components/ui";
```

## 🚀 Usage Examples

### Example 1: Login Component

```typescript
"use client";
import { useAuth } from "@/app/lib/hooks";

export default function LoginPage() {
  const { loginPlayer } = useAuth();

  const handleSubmit = async (name, email, language) => {
    await loginPlayer(name, email, language);
  };

  // ...
}
```

### Example 2: Game Page

```typescript
"use client";
import { useGame } from "@/app/lib/hooks";

export default function GamePage() {
  const { chests, unlockChest } = useGame();

  // ...
}
```

## 🔐 Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## 📊 Data Flow

1. **User Action** → Component calls custom hook
2. **Hook** → Calls API service
3. **Service** → Makes HTTP request
4. **Response** → Updates Zustand store
5. **Store** → Triggers component re-render

## 🎯 Best Practices

1. **Always use custom hooks** instead of direct store access
2. **Keep API logic in services**, not in components
3. **Use barrel exports** for clean imports
4. **Validate inputs** using utility validators
5. **Handle loading and error states** in hooks
6. **Use TypeScript types** for all data structures

## 🔄 State Management Flow

```
Component → useAuth() → AuthStore → LocalStorage (persisted)
Component → useSession() → SessionStore → Memory (temporary)
Component → useGame() → GameStore → Memory (temporary)
```

## 📚 Additional Resources

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
