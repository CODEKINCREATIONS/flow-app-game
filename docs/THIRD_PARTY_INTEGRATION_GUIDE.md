# Third-Party Integration Guide

## Overview

This guide shows how to integrate the Flow App Game dashboard with your third-party system for session verification.

## Integration Methods

### Method 1: Direct URL Redirect (Simplest)

Generate a dashboard link with the session code and redirect users:

```javascript
// In your third-party system
function redirectToDashboard(sessionCode) {
  const dashboardUrl = `https://flowapp.yourdomain.com/facilitator-dashboard?sessionCode=${encodeURIComponent(
    sessionCode
  )}`;
  window.location.href = dashboardUrl;
}

// Usage
redirectToDashboard("ABACDAS0123");
```

### Method 2: Link Generation (For QR Codes, Emails, etc.)

Generate shareable links for various distribution methods:

```javascript
class DashboardLinkGenerator {
  constructor(baseUrl = "https://flowapp.yourdomain.com") {
    this.baseUrl = baseUrl;
  }

  // Query string format (works with any device)
  getQueryStringLink(sessionCode) {
    return `${
      this.baseUrl
    }/facilitator-dashboard?sessionCode=${encodeURIComponent(sessionCode)}`;
  }

  // Path parameter format (cleaner URLs)
  getPathParameterLink(sessionCode) {
    return `${this.baseUrl}/facilitator-dashboard/${encodeURIComponent(
      sessionCode
    )}`;
  }

  // For QR codes
  generateQRLink(sessionCode) {
    // Use the cleaner path format for QR codes
    return this.getPathParameterLink(sessionCode);
  }

  // For email links
  generateEmailLink(sessionCode, recipientName) {
    const link = this.getQueryStringLink(sessionCode);
    return `
      <p>Hello ${recipientName},</p>
      <p>Your session is ready. Click below to access the dashboard:</p>
      <a href="${link}">Launch Dashboard</a>
    `;
  }

  // For SMS links (short URL recommended)
  generateSMSLink(sessionCode) {
    // Use path format as it's shorter
    return this.getPathParameterLink(sessionCode);
  }
}

// Usage
const linkGen = new DashboardLinkGenerator();

// For web redirect
const webLink = linkGen.getQueryStringLink("ABC123");

// For QR code
const qrLink = linkGen.generateQRLink("ABC123");

// For email
const emailLink = linkGen.generateEmailLink("ABC123", "John Doe");

// For SMS
const smsLink = linkGen.generateSMSLink("ABC123");
```

### Method 3: API Integration (For Programmatic Access)

First verify the session on your backend, then send link to frontend:

```javascript
// Your backend (Node.js/Express example)
const axios = require("axios");

async function verifyAndGetDashboardLink(sessionCode) {
  try {
    // Verify session with Flow App API
    const verificationUrl =
      "https://flowapp.yourdomain.com/api/auth/verify-session";
    const response = await axios.get(verificationUrl, {
      params: { sessionCode },
    });

    if (response.data.success) {
      // Session is valid, generate link
      const dashboardLink = `https://flowapp.yourdomain.com/facilitator-dashboard?sessionCode=${sessionCode}`;
      return {
        success: true,
        link: dashboardLink,
        sessionData: response.data.data,
      };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Your frontend
async function handleSessionAccess(sessionCode) {
  try {
    const response = await fetch("/api/get-dashboard-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode }),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = result.link;
    } else {
      console.error("Session verification failed:", result.error);
      showError(result.error);
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to access dashboard");
  }
}
```

### Method 4: OAuth/Session Integration

If you have your own authentication system:

```javascript
// Your system's authentication flow
class FlowAppSessionBridge {
  async createSessionForUser(userId, userEmail) {
    // 1. Create session in Flow App
    const sessionResponse = await fetch(
      "https://flowapp.yourdomain.com/api/sessions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilitatorId: userId,
          facilitatorEmail: userEmail,
        }),
      }
    );

    const sessionData = await sessionResponse.json();
    const sessionCode = sessionData.data.code;

    // 2. Store session mapping in your system
    await this.storeSessionMapping(userId, sessionCode);

    // 3. Return dashboard link
    return `https://flowapp.yourdomain.com/facilitator-dashboard?sessionCode=${sessionCode}`;
  }

  async storeSessionMapping(userId, sessionCode) {
    // Store in your database
    await db.sessions.create({
      userId,
      sessionCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
  }

  async getUserSession(userId) {
    // Retrieve session from your database
    const session = await db.sessions.findOne({ userId });
    if (session && session.expiresAt > new Date()) {
      return `https://flowapp.yourdomain.com/facilitator-dashboard?sessionCode=${session.sessionCode}`;
    }
    return null;
  }
}

// Usage
const bridge = new FlowAppSessionBridge();
const dashboardLink = await bridge.createSessionForUser(
  "user123",
  "user@example.com"
);
window.location.href = dashboardLink;
```

## URL Format Options

### Option A: Query String (Recommended for External Systems)

```
https://flowapp.yourdomain.com/facilitator-dashboard?sessionCode=ABC123DEF456
```

**Pros:**

- Works everywhere
- Easy to append to existing URLs
- Works with query string routing

**Cons:**

- Longer URL
- Session code visible in URL

### Option B: Path Parameter (Recommended for Internal Links)

```
https://flowapp.yourdomain.com/facilitator-dashboard/ABC123DEF456
```

**Pros:**

- Cleaner URLs
- Better for QR codes
- RESTful style

**Cons:**

- Requires dynamic routing setup

## Error Handling

Always handle potential errors when redirecting:

```javascript
async function safeRedirectToDashboard(sessionCode) {
  try {
    // Pre-verify session before redirect
    const verifyResponse = await fetch(
      `/api/auth/verify-session?sessionCode=${encodeURIComponent(sessionCode)}`
    );

    const result = await verifyResponse.json();

    if (result.success) {
      // Session is valid, proceed with redirect
      const link = `https://flowapp.yourdomain.com/facilitator-dashboard?sessionCode=${sessionCode}`;
      window.location.href = link;
    } else {
      // Show error without redirecting
      showErrorMessage(result.message || "Invalid session code");
    }
  } catch (error) {
    showErrorMessage("Unable to verify session. Please try again.");
    console.error("Session verification error:", error);
  }
}
```

## Common Integration Patterns

### Pattern 1: Button Click

```jsx
<button onClick={() => redirectToDashboard("ABC123")}>Launch Dashboard</button>
```

### Pattern 2: Auto-Redirect After Login

```javascript
async function handleLogin(credentials) {
  const user = await authenticateUser(credentials);
  const sessionCode = await createFlowAppSession(user.id);
  window.location.href = `/facilitator-dashboard?sessionCode=${sessionCode}`;
}
```

### Pattern 3: Generate QR Code

```javascript
import QRCode from "qrcode";

async function generateDashboardQR(sessionCode) {
  const url = `https://flowapp.yourdomain.com/facilitator-dashboard/${sessionCode}`;
  const qrCanvas = await QRCode.toCanvas(url);
  return qrCanvas; // Display in your UI
}
```

### Pattern 4: Email Invitation

```javascript
function generateInvitationEmail(sessionCode, recipientEmail) {
  const dashboardLink = `https://flowapp.yourdomain.com/facilitator-dashboard?sessionCode=${sessionCode}`;

  const emailBody = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>You're invited to Flow App Game!</h2>
        <p>Your session is ready to begin.</p>
        <a href="${dashboardLink}" style="
          display: inline-block;
          padding: 12px 30px;
          background-color: #7B61FF;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">
          Access Dashboard
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Or copy this link: ${dashboardLink}
        </p>
      </body>
    </html>
  `;

  return {
    to: recipientEmail,
    subject: "Your Flow App Game Session is Ready",
    html: emailBody,
  };
}
```

## Testing Your Integration

```javascript
// Test all URL formats
const testCases = [
  "https://localhost:3000/facilitator-dashboard?sessionCode=TEST001",
  "https://localhost:3000/facilitator-dashboard/TEST001",
  "https://localhost:3000/facilitator-dashboard?code=TEST001",
  "https://localhost:3000/facilitator-dashboard?session=TEST001",
];

// Test error handling
const errorTestCases = [
  "https://localhost:3000/facilitator-dashboard?sessionCode=INVALID",
  "https://localhost:3000/facilitator-dashboard?sessionCode=",
  "https://localhost:3000/facilitator-dashboard",
];
```

## Security Best Practices

1. **Always verify on the server side** - Never trust session codes from the client
2. **Use HTTPS** - Especially when session codes are in URLs
3. **Session expiration** - Implement time limits on session codes
4. **Rate limiting** - Prevent brute force attempts on session verification
5. **Logging** - Track all session access attempts
6. **User validation** - Ensure the user has permission to access the session

```javascript
// Example server-side security check
async function verifySessionAccess(sessionCode, userId) {
  // 1. Verify session exists and is valid
  const session = await getSessionFromDB(sessionCode);
  if (!session || session.isExpired) {
    throw new Error("Invalid or expired session");
  }

  // 2. Verify user owns this session
  if (session.facilitatorId !== userId) {
    logSecurityEvent("Unauthorized session access attempt", {
      userId,
      sessionCode,
    });
    throw new Error("Unauthorized");
  }

  // 3. Log the access
  await logSessionAccess(sessionCode, userId);

  return true;
}
```

## Monitoring & Analytics

Track integration metrics:

```javascript
// Log successful integrations
function logIntegrationEvent(eventType, data) {
  fetch("/api/analytics/integration-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType, // 'dashboard_redirect', 'session_verified', 'error', etc.
      timestamp: new Date(),
      ...data,
    }),
  });
}

// Track redirects
logIntegrationEvent("dashboard_redirect", {
  sessionCode: "ABC123",
  source: "email",
});

// Track verification success
logIntegrationEvent("session_verified", {
  sessionCode: "ABC123",
  responseTime: 456,
});

// Track errors
logIntegrationEvent("verification_error", {
  sessionCode: "INVALID",
  errorMessage: "Invalid session code",
});
```

---

**For more details**, see:

- `SESSION_VERIFICATION_QUERY_STRINGS.md` - Full implementation details
- `SESSION_VERIFICATION_QUICK_REFERENCE.md` - Quick reference guide
