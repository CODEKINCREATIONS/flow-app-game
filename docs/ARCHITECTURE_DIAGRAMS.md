# Session Verification - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Third-Party System                         │
│  (External platform that needs to send users to dashboard)      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Generate link with session code
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              URL with Session Code in Parameter                 │
│  ┌─ ?sessionCode=ABC123                                        │
│  ├─ ?code=ABC123                                               │
│  └─ /facilitator-dashboard/ABC123                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Browser navigates to URL
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Facilitator Dashboard (React)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ useQueryStringSession Hook                              │   │
│  ├─ Reads session code from URL                            │   │
│  ├─ Manages verification state                             │   │
│  └─ Handles redirects                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Call verify API
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js API Route                                  │
│              /api/auth/verify-session                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Proxy to Azure
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure Backend                                      │
│  /Session/verifySessionCode?sessionCode=ABC123                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Validate & return result
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Response                                           │
│  {                                                              │
│    "success": true,                                             │
│    "data": { id, code, status, ... }                            │
│  }                                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼ Success            ▼ Failure
        ┌───────────────┐      ┌──────────────┐
        │   Dashboard   │      │ Error Page   │
        │   Displays    │      │   Displays   │
        └───────────────┘      └──────────────┘
```

## Component Hierarchy

```
App Root
│
└─ FacilitatorDashboard (Wrapper)
   │
   ├─ Suspense Boundary (Loading fallback)
   │
   └─ FacilitatorDashboardContent
      │
      ├─ Hooks:
      │  ├─ useQueryStringSession (NEW)
      │  ├─ useSession
      │  ├─ useAuth
      │  ├─ useTimerContext
      │  └─ useState (for UI state)
      │
      ├─ Effects:
      │  └─ useEffect (verify on mount)
      │
      └─ Render:
         ├─ Loading State (spinner)
         ├─ Error State (error page)
         └─ Dashboard Content
            ├─ AppLayout
            │  ├─ Header
            │  ├─ Main Content
            │  │  ├─ SessionDetails
            │  │  └─ PlayerProgress
            │  └─ Footer
            │
            └─ QRCodeDialog
```

## State Machine

```
                    START
                      │
                      ▼
            ┌────────────────────┐
            │   isVerifying:true │
            │  Loading State UI  │
            └────────┬───────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    Verification Succeeds   Verification Fails
          │                     │
          ▼                     ▼
    ┌──────────────┐    ┌─────────────────┐
    │isVerified:true    │ isVerified:false │
    │Display Dashboard  │ error: "message" │
    │Session stored     │ Show Error Page  │
    │  isVerifying:false │ isVerifying:false│
    └──────────────┘    └─────────────────┘
          │                     │
          │                     │
    User can work          User can retry
    or finish session    or go home/login
```

## Data Flow

```
URL Parameters
      │
      ├─ Query String: ?sessionCode=ABC123
      ├─ Query String: ?code=ABC123
      ├─ Query String: ?session=ABC123
      └─ Path: /facilitator-dashboard/ABC123
      │
      ▼
useQueryStringSession Hook
      │
      ├─ useSearchParams() / useParams()
      │
      ├─ Extract session code
      │
      ├─ Validate exists
      │
      └─ Call authService.verifySessionCode()
              │
              ▼
        API: /api/auth/verify-session
              │
              ▼
        Backend: Azure /Session/verifySessionCode
              │
              ▼
        Response: { success, data/error }
              │
              ├─ Success:
              │   └─ setSession(data)
              │   └─ Update store
              │   └─ Set isVerified: true
              │
              └─ Failure:
                  └─ Set error message
                  └─ Set isVerified: false
                  └─ Redirect to error page
```

## Verification Process Timeline

```
T=0ms     User clicks link
          http://localhost:3000/facilitator-dashboard?sessionCode=ABC123

T=50ms    Page loads, React renders
          useQueryStringSession hook runs

T=100ms   useEffect detects session code
          Starts verification process

T=150ms   API call made to /api/auth/verify-session
          Loading spinner shows

T=600ms   Backend processes
          - Checks session code
          - Calls Azure API
          - Validates response

T=700ms   Response received by frontend
          ✓ Success: Store session, set isVerified:true
          ✗ Failed: Set error, prepare redirect

T=750ms   React re-renders with result
          ✓ Dashboard displays
          ✗ Redirect to error page

T=1000ms  User sees final UI
          Ready to interact
```

## Error Flow

```
User accesses with invalid code
           │
           ▼
useQueryStringSession reads URL
           │
           ▼
Calls authService.verifySessionCode()
           │
           ▼
API returns { success: false, error: "Invalid code" }
           │
           ▼
Hook sets: { isVerified: false, error: "Invalid code" }
           │
           ▼
FacilitatorDashboardContent renders Error State UI
           │
           ▼
Shows message + buttons
           │
      ┌────┴────┐
      │          │
  [Retry]   [Go Home]
      │          │
      ▼          ▼
redirect    redirect
to error    to home
page        page
```

## Success Flow

```
User accesses with valid code
           │
           ▼
useQueryStringSession reads URL
           │
           ▼
Calls authService.verifySessionCode()
           │
           ▼
API returns { success: true, data: {...} }
           │
           ▼
Hook calls setSession(data)
           │
           ▼
Session stored in useSessionStore
           │
           ▼
Hook sets: { isVerified: true, error: null }
           │
           ▼
FacilitatorDashboardContent renders Dashboard Content
           │
           ▼
User sees:
- Session Details
- Player Progress
- QR Code & Unlock buttons
- Dashboard is fully functional
```

## File Structure

```
app/
├── lib/
│   └── hooks/
│       ├── useQueryStringSession.ts (NEW)
│       │   └── Custom hook for session verification
│       │
│       ├── useSession.ts (existing)
│       ├── useAuth.ts (existing)
│       ├── useTimer.ts (existing)
│       └── index.ts (modified)
│           └── Now exports useQueryStringSession
│
├── facilitator-dashboard/
│   ├── page.tsx (modified)
│   │   └── Query string verification integrated
│   │
│   └── [sessionCode]/ (NEW DIRECTORY)
│       └── page.tsx (NEW)
│           └── Path parameter route handler
│
├── session-error/ (NEW DIRECTORY)
│   └── page.tsx (NEW)
│       └── Error page component
│
└── api/
    └── auth/
        └── verify-session/
            └── route.ts (existing)
                └── Used by both flows
```

## Hook Lifecycle

```
Component Mount
       │
       ▼
useQueryStringSession Hook Init
├─ Initialize state:
│  ├─ isVerifying: true
│  ├─ isVerified: false
│  ├─ error: null
│  └─ sessionCode: null
│
├─ Setup useCallback functions:
│  ├─ verifyFromQueryString
│  ├─ redirectToLogin
│  └─ redirectToError
│
└─ Return hook state & functions

Effect Hook Runs
       │
       ▼
Check sessionVerificationChecked
├─ If false:
│  └─ Call verifyFromQueryString()
│
└─ Set sessionVerificationChecked: true

Verification Process
       │
       ├─ Read session code
       ├─ Call API
       ├─ Update state
       └─ Return verification result

Component Re-render
       │
       └─ Render appropriate UI:
          ├─ Loading spinner
          ├─ Error message
          └─ Dashboard content

Component Unmount
       │
       ▼
Cleanup (Suspense boundary)
└─ State cleared
```

## Integration Points

```
useQueryStringSession Hook
       │
       ├─ Uses: useSearchParams (Next.js)
       ├─ Uses: useRouter (Next.js)
       ├─ Calls: authService.verifySessionCode()
       └─ Calls: useSessionStore.setSession()
            │
            ├─ Connects to: Session Store
            ├─ Connects to: Auth Store
            ├─ Connects to: API Client
            └─ Connects to: Azure Backend
                     │
                     └─ /Session/verifySessionCode
```

## Response Handling

```
API Response
       │
       ├─ If response.ok && response.data:
       │  ├─ success: true
       │  ├─ Store session data
       │  ├─ isVerified: true
       │  └─ Display dashboard
       │
       └─ If !response.ok or error:
          ├─ success: false
          ├─ Extract error message
          ├─ isVerified: false
          └─ Show error page
```

## URL Routing

```
Request comes in
       │
       ├─ Pattern 1: /facilitator-dashboard?sessionCode=ABC
       │  └─ Routed to: page.tsx (query string handler)
       │
       ├─ Pattern 2: /facilitator-dashboard/ABC
       │  └─ Routed to: [sessionCode]/page.tsx (path handler)
       │
       └─ Pattern 3: /facilitator-dashboard
          └─ Routed to: page.tsx (normal flow)
```

---

**For implementation details, see**: `SESSION_VERIFICATION_QUERY_STRINGS.md`  
**For quick reference, see**: `SESSION_VERIFICATION_QUICK_REFERENCE.md`  
**For integration, see**: `THIRD_PARTY_INTEGRATION_GUIDE.md`
