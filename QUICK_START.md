# Quick Start Guide - Flow App Game

## 🎯 Using the New Architecture

### Importing Components

```typescript
// ✅ New (Clean)
import { Button, Card, Input } from "@/app/components/ui";

// ❌ Old
import Button from "@/app/components/ui/Button";
```

### Using Custom Hooks

```typescript
// Authentication
import { useAuth } from "@/app/lib/hooks";
const { user, loginPlayer, logout } = useAuth();

// Session Management
import { useSession } from "@/app/lib/hooks";
const { session, fetchSession, endSession } = useSession();

// Game State
import { useGame } from "@/app/lib/hooks";
const { chests, unlockChest, fetchChests } = useGame();

// Timer
import { useTimer } from "@/app/lib/hooks/useTimer";
const { formatted, start, pause } = useTimer({ autoStart: true });
```

### Using API Services

```typescript
import {
  authService,
  sessionService,
  gameService,
} from "@/app/lib/api/services";

// Example
const result = await authService.loginFacilitator(code);
const session = await sessionService.getSession(sessionId);
const chests = await gameService.getChests(sessionId);
```

### Using Utilities

```typescript
import { validators, formatters, constants } from "@/app/lib/utils";

// Validation
const isValid = validators.isValidEmail(email);

// Formatting
const formatted = formatters.formatTime(seconds);

// Constants
const chestCount = constants.GAME_CONSTANTS.CHEST_COUNT;
```

## 📁 File Organization

### Adding a New Component

```
app/components/
└── my-component/
    └── MyComponent.tsx
```

### Adding a New Hook

```
app/lib/hooks/
└── useMyFeature.ts
```

### Adding a New Store

```
app/lib/store/
└── myStore.ts
```

### Adding a New Service

```
app/lib/api/services/
└── myService.ts
```

## 🔑 Key Patterns

### 1. **Component with Hook**

```typescript
"use client";
import { useAuth } from "@/app/lib/hooks";

export default function MyComponent() {
  const { user, loginPlayer } = useAuth();

  const handleLogin = async () => {
    await loginPlayer(name, email, language);
  };

  return <div>{user?.name}</div>;
}
```

### 2. **Using Zustand Directly** (if needed)

```typescript
import { useAuthStore } from "@/app/lib/store/authStore";

export function MyComponent() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.loginPlayer);
  // ...
}
```

### 3. **API Call with Error Handling**

```typescript
const { fetchSession, loading, error } = useSession();

useEffect(() => {
  const loadSession = async () => {
    const result = await fetchSession(sessionId);
    if (!result.success) {
      console.error(result.error);
    }
  };
  loadSession();
}, [sessionId]);
```

## 🎨 Styling

All components use Tailwind CSS with your custom colors:

- Background: `bg-[#0F1125]`
- Surface: `bg-[#1A1C33]`
- Primary: `from-[#7B61FF] to-[#3A8DFF]`
- Text: `text-white` or `text-textPrimary`

## 🚀 Development Workflow

1. **Run dev server**: `npm run dev`
2. **Make changes** to components/hooks/services
3. **Check types**: TypeScript will catch errors
4. **Test functionality**: All stores persist and update properly

## 🔍 Debugging

### Check Store State

```typescript
// In any component
const authState = useAuthStore.getState();
console.log("Auth:", authState);
```

### Check Hook State

```typescript
const { user, session, chests } = useAuth();
console.log("User:", user);
```

## 📦 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## ✅ Best Practices

1. ✅ Always use custom hooks, not direct store access
2. ✅ Keep business logic in hooks/services, not components
3. ✅ Use TypeScript types for all data
4. ✅ Handle loading and error states
5. ✅ Use barrel exports for clean imports

## 🎓 Learning Resources

- **Zustand**: https://docs.pmnd.rs/zustand
- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

## 💡 Next Steps

1. Implement API routes in `app/api/`
2. Add WebSocket for real-time updates
3. Create more game components
4. Add error boundaries
5. Write unit tests

---

Happy coding! 🚀
