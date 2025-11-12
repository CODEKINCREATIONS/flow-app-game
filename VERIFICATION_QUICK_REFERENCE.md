# Quick Reference - Session Verification Integration

## What Was Added?

A new "Verify Session Code" feature on the Facilitator Login page that allows facilitators to verify their session code through a modal dialog and gain access to the facilitator dashboard.

## Quick Start

### For Users
1. Go to `/facilitator-login`
2. Click **"Verify Session Code"** button
3. Enter your 3-character session code in the modal
4. Click **"Submit Code"**
5. If valid → Redirected to `/facilitator-dashboard`
6. If invalid → See error message, can retry

### For Developers

#### To Use Session Verification in a Component
```typescript
import { sessionService } from "@/app/lib/api/services/sessions";

// Verify a session code
const response = await sessionService.verifySessionCode("ABC123");

if (response.success && response.data) {
  console.log("Session verified:", response.data);
  // Navigate or proceed
} else {
  console.error("Verification failed:", response.error);
}
```

#### To Access Verification State
```typescript
import { useSessionStore } from "@/app/lib/store/sessionStore";

const { verifying, verificationError, setVerifying, setVerificationError } = useSessionStore();

// Use in your component
if (verifying) {
  // Show loading state
}

if (verificationError) {
  // Show error message
}
```

#### To Use the Modal in Another Page
```typescript
import CodeEntryModal from "@/app/components/CodeEntryModal";

export default function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeSubmit = async (code: string) => {
    setIsLoading(true);
    // Process code...
    setIsLoading(false);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Enter Code
      </button>
      
      <CodeEntryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCodeSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
```

---

## File Locations

```
app/
├── types/
│   └── session.ts                    ← SessionVerificationResponse type
├── lib/
│   ├── api/
│   │   └── services/
│   │       └── sessions.ts           ← verifySessionCode() method
│   └── store/
│       └── sessionStore.ts           ← Verification state
├── components/
│   └── CodeEntryModal.tsx            ← Modal component (updated)
├── facilitator-login/
│   └── page.tsx                      ← Login page (updated)
└── facilitator-dashboard/
    └── page.tsx                      ← Destination after verification

docs/
├── SESSION_VERIFICATION_SETUP.md     ← Full documentation
├── CODE_CHANGES_DETAILED.md          ← Detailed code changes
└── VERIFICATION_INTEGRATION_SUMMARY.md ← This guide
```

---

## API Endpoint

**URL:** `https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/Session/verifySessionCode?sessionCode={CODE}`

**Example Request:**
```
GET /Session/verifySessionCode?sessionCode=ABC123
```

**Example Responses:**

✅ Success:
```json
{
  "success": true,
  "message": "Session verified successfully",
  "sessionCode": "ABC123",
  "status": "active"
}
```

❌ Failure:
```json
{
  "success": false,
  "message": "Invalid code"
}
```

---

## Key Features

| Feature | Details |
|---------|---------|
| **Code Input** | 3 input fields, auto-focus, alphanumeric support |
| **Auto-uppercase** | Lowercase letters automatically converted to uppercase |
| **Loading State** | Inputs disabled during verification, "Verifying..." text |
| **Error Messages** | Displayed inline in modal, user can retry |
| **Navigation** | Auto-redirect to `/facilitator-dashboard` on success |
| **State Management** | Uses Zustand for verification state |
| **No External Deps** | Uses existing project dependencies |

---

## Common Tasks

### Debug API Call
```typescript
// In browser console
const response = await fetch(
  'https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/Session/verifySessionCode?sessionCode=ABC123'
);
const data = await response.json();
console.log(data);
```

### Check Verification State
```typescript
// Add this to any component
import { useSessionStore } from "@/app/lib/store/sessionStore";

export default function DebugComponent() {
  const { verifying, verificationError } = useSessionStore();
  
  return (
    <div>
      <p>Verifying: {verifying ? 'Yes' : 'No'}</p>
      <p>Error: {verificationError || 'None'}</p>
    </div>
  );
}
```

### Modify Error Messages
**File:** `app/facilitator-login/page.tsx`

Look for lines around 29-40:
```typescript
const errorMessage = response.error || "Invalid session code";  // ← Customize here
```

### Change Code Format Validation
**File:** `app/components/CodeEntryModal.tsx`

Look for line with regex:
```typescript
if (/^[0-9a-zA-Z]?$/.test(value)) {  // ← Change regex here
```

Examples:
- Only digits: `/^[0-9]?$/`
- Only letters: `/^[a-zA-Z]?$/`
- Specific length: Check in `handleSubmit()` function

---

## Troubleshooting

### Modal Doesn't Show
- Check: Is `showCodeModal` state true?
- Check: Are you passing `open={showCodeModal}` prop?
- Check: Is `onClose` callback working?

### API Call Fails
- Check: Is API URL correct?
- Check: Is network connection working?
- Check: Check browser DevTools Network tab for actual request

### Code Not Verifying
- Check: Is code format correct?
- Check: Is code still valid (not expired)?
- Check: Check browser console for error messages

### User Not Redirected
- Check: Is `router.push()` working?
- Check: Does `/facilitator-dashboard` page exist?
- Check: Is there a client component wrapper?

---

## Testing Commands

```bash
# Build and check for errors
npm run build

# Run development server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Format code
npm run format

# Lint code
npm run lint
```

---

## Status

✅ **INTEGRATION COMPLETE**
- All files created/modified
- No compilation errors
- Ready for testing
- Documentation provided

---

## Support Documents

1. **SESSION_VERIFICATION_SETUP.md** - Full technical documentation
2. **CODE_CHANGES_DETAILED.md** - Line-by-line code changes
3. **VERIFICATION_INTEGRATION_SUMMARY.md** - Complete overview
4. **This file** - Quick reference guide

---

## Next Steps

1. ✅ Test with valid session code
2. ✅ Test with invalid session code
3. ✅ Test network error scenarios
4. ✅ Verify navigation to dashboard works
5. 📋 (Optional) Customize error messages
6. 📋 (Optional) Add analytics/logging
7. 📋 (Optional) Add rate limiting
8. 📋 (Optional) Deploy to production

---

**Last Updated:** November 12, 2025
**Status:** ✅ Ready for Testing
