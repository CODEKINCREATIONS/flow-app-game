# Session Verification Integration

## Overview
Integrated the Azure session verification endpoint with the Flow App game to enable players to verify their session code before entering their details.

## Endpoint
- **Base URL**: `https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net`
- **Endpoint**: `/Session/verifySessionCode`
- **Method**: GET
- **Query Parameter**: `sessionCode` (e.g., `ABACDAS0123`)
- **Response**: `SessionVerification` object

## Changes Made

### 1. Type Definitions (`app/types/session.ts`)
Added new `SessionVerification` interface to handle the API response:

```typescript
export interface SessionVerification {
  valid: boolean;
  sessionId?: string;
  sessionCode?: string;
  status?: string;
  message?: string;
}
```

### 2. Session Service (`app/lib/api/services/sessions.ts`)
Added new method to verify session codes:

```typescript
verifySessionCode: async (sessionCode: string) => {
  return apiClient.get<SessionVerification>(
    `/Session/verifySessionCode?sessionCode=${sessionCode}`
  );
}
```

### 3. Session Hook (`app/lib/hooks/useSession.ts`)
Added `verifySessionCode` function to the custom hook for easy integration in components:

```typescript
const verifySessionCode = useCallback(
  async (sessionCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sessionService.verifySessionCode(sessionCode);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || "Failed to verify session code");
        return { valid: false };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { valid: false };
    } finally {
      setLoading(false);
    }
  },
  [setLoading, setError]
);
```

### 4. Player Login Page (`app/playerlogin/page.tsx`)
Implemented a two-step login flow:

#### Step 1: Session Verification
- Players enter their session code (e.g., `ABACDAS0123`)
- The code is verified against the Azure endpoint
- On success, the form progresses to Step 2

#### Step 2: Player Details
- After session verification, players enter:
  - Name
  - Email
  - Language preference
- Once submitted, they join the game session

**Features**:
- Loading states for both verification and login
- Error handling with user-friendly messages
- Back button to return to session code entry
- Code input is automatically converted to uppercase
- Input validation for all fields

## API Request/Response Flow

### Request
```
GET https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/Session/verifySessionCode?sessionCode=ABACDAS0123
```

### Expected Response (Success)
```json
{
  "valid": true,
  "sessionId": "session-123",
  "sessionCode": "ABACDAS0123",
  "status": "active",
  "message": "Session code verified successfully"
}
```

### Expected Response (Failure)
```json
{
  "valid": false,
  "message": "Session code not found or invalid"
}
```

## Environment Configuration
The API URL is configured in `app/lib/config/env.ts`. Ensure the `NEXT_PUBLIC_API_URL` environment variable points to:
```
https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net
```

## Usage Example

```tsx
import { useSession } from "@/app/lib/hooks";

export default function MyComponent() {
  const { verifySessionCode, loading, error } = useSession();

  const handleVerify = async () => {
    const result = await verifySessionCode("ABACDAS0123");
    if (result.valid) {
      console.log("Session verified:", result.sessionId);
    }
  };

  return (
    <div>
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify Session"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

## Error Handling
- **Invalid session code**: User sees "Invalid session code. Please try again."
- **Network errors**: Caught and displayed to user
- **Validation errors**: Field-level validation before API call
- **UI state**: Buttons are disabled during loading to prevent duplicate requests

## Testing the Integration

1. Navigate to `/playerlogin`
2. Enter a valid session code (e.g., `ABACDAS0123`)
3. Click "Verify Session"
4. Upon success, proceed to enter player details
5. Click "Join Game" to complete the login

## Notes
- The session code verification happens before player details are submitted
- This ensures only valid sessions can receive players
- The API endpoint should return `valid: true` for active sessions
- The integration is fully type-safe using TypeScript
