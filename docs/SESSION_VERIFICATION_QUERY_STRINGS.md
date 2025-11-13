# Session Verification Implementation Guide

## Overview

This document describes the implementation of session verification for users accessing the dashboard from third-party sources using query strings. The system supports two URL patterns for session verification.

## Features Implemented

### 1. Query String Session Verification

- Reads session codes from URL query parameters
- Verifies sessions through the existing Azure API endpoint
- Handles both success and failure cases gracefully
- Supports multiple parameter names for flexibility

### 2. URL Patterns Supported

#### Pattern 1: Query String Parameters (Default)

```
http://localhost:3000/facilitator-dashboard?sessionCode=ABACDAS0123
http://localhost:3000/facilitator-dashboard?code=ABACDAS0123
http://localhost:3000/facilitator-dashboard?session=ABACDAS0123
```

#### Pattern 2: URL Path Parameter (Alternative)

```
http://localhost:3000/facilitator-dashboard/ABACDAS0123
```

### 3. Verification Flow

1. **Page Load**: User accesses dashboard with session code in URL
2. **Verification**: Frontend reads query parameter and calls verification API
3. **Loading State**: Shows loading spinner while verifying
4. **Success**: If valid, stores session and displays dashboard
5. **Failure**: If invalid, redirects to error page with error message

## Files Created

### 1. `app/lib/hooks/useQueryStringSession.ts`

Custom React hook for handling session verification from query strings.

**Key Functions:**

- `verifyFromQueryString()`: Extracts session code from URL and calls verification API
- `redirectToLogin()`: Redirects user to login page
- `redirectToError()`: Redirects to error page with error message

**State Properties:**

- `isVerifying`: Boolean indicating verification in progress
- `isVerified`: Boolean indicating successful verification
- `error`: Error message if verification failed
- `sessionCode`: The session code extracted from URL

### 2. `app/facilitator-dashboard/page.tsx` (Updated)

Modified to integrate session verification from query strings.

**Changes:**

- Added `useQueryStringSession` hook integration
- Added verification effect hook that runs on component mount
- Added loading state UI
- Added error handling UI
- Wrapped component with `Suspense` for async operations

### 3. `app/facilitator-dashboard/[sessionCode]/page.tsx` (New)

Dynamic route handler for dashboard with session code in URL path.

**Features:**

- Accepts session code as URL parameter
- Performs verification on mount
- Shows loading state during verification
- Redirects to error page on verification failure
- Displays dashboard on verification success

### 4. `app/session-error/page.tsx` (New)

Error page shown when session verification fails.

**Features:**

- Displays error message from query parameter
- Provides helpful context about the error
- Offers buttons to:
  - Return to login page
  - Go to home page
- Professional error UI with icons

## Usage Examples

### From Third-Party Source (Query String)

```javascript
// Your third-party system redirects users to:
const dashboardUrl = `http://localhost:3000/facilitator-dashboard?sessionCode=${sessionCode}`;
window.location.href = dashboardUrl;
```

### From Third-Party Source (Path Parameter)

```javascript
// Alternative pattern:
const dashboardUrl = `http://localhost:3000/facilitator-dashboard/${sessionCode}`;
window.location.href = dashboardUrl;
```

### Direct Link

```
http://localhost:3000/facilitator-dashboard/ABACDAS0123
or
http://localhost:3000/facilitator-dashboard?sessionCode=ABACDAS0123
```

## API Integration

The implementation uses the existing session verification API:

**Endpoint:** `/api/auth/verify-session`

**Parameters:**

- `sessionCode` (query string): The session code to verify

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "session-id",
    "code": "ABACDAS0123",
    "status": "active",
    ...
  }
}
```

## Error Handling

### Verification Failures

- No session code in URL: Allows normal dashboard flow
- Invalid session code: Shows error page with message
- API errors: Shows error page with error details
- Network errors: Shows error page with error details

### Redirect Logic

- Valid session → Stay on dashboard
- Invalid session → Redirect to `/session-error?error=[message]`
- No session → Normal dashboard flow (existing behavior)

## State Management

Session data is stored in `useSessionStore` which persists:

- Session ID
- Session code
- Session status
- Player information
- Session details

## Loading States

### Initial Verification Loading

Shows spinner with message "Verifying session..."

### Verification Complete

- **Success**: Dashboard content displays
- **Failure**: Error page with retry options

### Fallback Loading

Suspense boundary shows loading message while component initializes

## Security Considerations

1. **Server-Side Verification**: Session validation happens on the server via `/api/auth/verify-session`
2. **Sensitive Data**: Session data is validated before storing
3. **URL Parameters**: Query strings are properly encoded/decoded
4. **Error Messages**: Error details are shown to help debugging

## Testing the Implementation

### Test Case 1: Valid Session Code (Query String)

```
1. Navigate to: http://localhost:3000/facilitator-dashboard?sessionCode=ABACDAS0123
2. Expected: Loading spinner appears → Dashboard displays
```

### Test Case 2: Valid Session Code (Path Parameter)

```
1. Navigate to: http://localhost:3000/facilitator-dashboard/ABACDAS0123
2. Expected: Loading spinner appears → Dashboard displays
```

### Test Case 3: Invalid Session Code

```
1. Navigate to: http://localhost:3000/facilitator-dashboard?sessionCode=INVALID123
2. Expected: Loading spinner → Error page with message
3. Can click "Return to Login" or "Go Home"
```

### Test Case 4: No Session Code

```
1. Navigate to: http://localhost:3000/facilitator-dashboard
2. Expected: Dashboard loads normally (existing behavior)
```

## Troubleshooting

### Issue: "Session code not found in URL"

- **Cause**: URL doesn't contain session code parameter
- **Solution**: Add `?sessionCode=` or `?code=` parameter to URL

### Issue: "Invalid session code" error

- **Cause**: Session code doesn't exist or has expired
- **Solution**: Verify session code is correct and not expired

### Issue: Verification never completes

- **Cause**: Network issue or API endpoint unreachable
- **Solution**: Check network connectivity and API endpoint configuration

### Issue: Session data not loading after verification

- **Cause**: Store not properly updated
- **Solution**: Check browser console for errors and verify API response

## Browser Compatibility

Works with all modern browsers that support:

- React 18+ hooks
- Next.js 13+ App Router
- ES6+ JavaScript

## Performance Considerations

1. **Single Verification**: Session verification runs only once on mount
2. **Minimal Re-renders**: Uses proper dependency arrays in useEffect
3. **Async Loading**: Shows loading UI while fetching
4. **Memory Efficient**: Cleans up on unmount via Suspense boundaries

## Future Enhancements

1. Add retry logic with exponential backoff
2. Add session timeout handling
3. Add analytics/logging for verification attempts
4. Add QR code generation for session codes
5. Add session management dashboard for facilitators
6. Add session expiration UI notifications

## Integration with Existing Code

### Already Integrated:

- Session verification API (`authService.verifySessionCode`)
- Session store (`useSessionStore`)
- Layout components (`AppLayout`)
- UI components (`Button`, etc.)

### No Breaking Changes:

- Existing facilitator login flow unchanged
- Direct dashboard access still works
- All existing features preserved
