# Browser DevTools Testing Guide

## Opening DevTools

**Windows/Linux:** Press `F12` or `Ctrl + Shift + I`  
**Mac:** Press `Cmd + Option + I`

---

## Test 1: Network Tab - Check API Responses

### Step 1: Open Network Tab

1. Press F12
2. Click "Network" tab at top
3. Make sure recording is on (red dot should be visible)

### Step 2: Clear Previous Requests

- Click trash icon in Network panel

### Step 3: Trigger Dashboard Load

- Navigate to facilitator dashboard
- You'll see API requests appear in Network tab

### Step 4: Find Dashboard API Call

- Look for request named `get-dashboard` or similar
- Click on it
- Click "Response" tab
- Look for `gameSessionId` field

**Expected Response Structure:**

```json
{
  "success": true,
  "data": {
    "gameSession": {
      "gameSessionId": 1,      ← LOOK FOR THIS
      "sessionCode": "ABC-XYZ",
      "sessionUnlocked": true
    }
  }
}
```

### Step 5: Unlock Session and Check Request

- Clear Network tab again
- Click "Unlock Session for Players"
- Look for unlock API request
- Click it → "Response" tab
- Should show success message

---

## Test 2: Console Tab - Check for Errors

### Step 1: Open Console Tab

1. Press F12
2. Click "Console" tab

### Step 2: Look for Errors

- Red text = errors
- Yellow text = warnings
- Black text = logs

**Good:** Console is clean with no red errors  
**Bad:** Red error messages appear

### Step 3: Reproduce Error

If you see an error:

1. Click the error message
2. It shows file name and line number
3. Use this to find the problematic code

### Step 4: Check Session Data

Type this in console:

```javascript
// Check if session data is loaded
JSON.parse(localStorage.getItem("sessionData"));
```

Expected output:

```javascript
{
  gameSessionId: 1,
  sessionCode: "SHI-HDS-XkkKi",
  sessionUnlocked: true,
  ...
}
```

---

## Test 3: Check QR Code Values

### Step 1: Click QR Code Button

1. Open QR Code dialog
2. Open DevTools Console (F12 → Console)

### Step 2: Get Session ID from URL

Type in console:

```javascript
// Get the sessionId from the QR code URL
const urlField = document.querySelector("input[readonly]");
if (urlField) {
  console.log("QR Code URL:", urlField.value);
} else {
  console.log("URL field not found");
}
```

Expected output:

```
QR Code URL: https://yourdomain.com/playerlogin?sessionId=1
```

### Step 3: Extract SessionId Parameter

```javascript
// Extract just the sessionId value
const url = new URL(urlField.value);
const sessionId = url.searchParams.get("sessionId");
console.log("SessionId:", sessionId);
console.log("Type:", typeof sessionId); // Should be "string"
console.log("As number:", parseInt(sessionId, 10)); // Should be 1
```

---

## Test 4: Monitor Player Login API Call

### Step 1: Clear Network Tab

- Open Network tab (F12 → Network)
- Click trash icon to clear

### Step 2: Navigate to Player Login Page

- Go to URL with sessionId:
  ```
  http://localhost:3000/playerlogin?sessionId=1
  ```

### Step 3: Fill Player Form

- Name: "Test Player"
- Email: "test@test.com"
- Language: "EN"

### Step 4: Watch Network Request

- Click "Join Game" button
- Look for new request in Network tab
- Look for request to `/api/auth/player` or `/auth/player`

### Step 5: Check Request Details

- Click the request
- Click "Request" tab
- Look for request body:

```json
{
  "name": "Test Player",
  "email": "test@test.com",
  "language": "en",
  "gameSessionId": 1    ← MUST BE HERE
}
```

### Step 6: Check Response

- Click "Response" tab
- Should show:

```json
{
  "success": true,
  "data": {
    "id": "player-123",
    "name": "Test Player",
    "gameSessionId": 1
  }
}
```

---

## Test 5: Check URL Query Parameter

### Step 1: Navigate to Player Login with SessionId

```
http://localhost:3000/playerlogin?sessionId=1
```

### Step 2: Open Console and Run:

```javascript
// Get the sessionId from URL
const params = new URLSearchParams(window.location.search);
const sessionId = params.get("sessionId");
console.log("SessionId from URL:", sessionId);
console.log("Type:", typeof sessionId);
console.log("Parsed as number:", parseInt(sessionId, 10));
```

Expected output:

```
SessionId from URL: 1
Type: string
Parsed as number: 1
```

---

## Test 6: Check Local Storage (If Using)

### In Console, Run:

```javascript
// Check all stored data
console.log("LocalStorage:", localStorage);

// Or check specific keys:
console.log("Auth data:", localStorage.getItem("authState"));
console.log("Session data:", localStorage.getItem("sessionData"));
```

---

## Test 7: Monitor API Calls in Real-Time

### Setup Logging

In your browser console, you can add logging by running:

```javascript
// Log all fetch requests
const originalFetch = window.fetch;
window.fetch = function (...args) {
  console.log(
    "🌐 API Call:",
    args[0],
    args[1]?.body ? JSON.parse(args[1].body) : ""
  );
  return originalFetch.apply(this, args);
};
```

Now every API call will be logged to console with method and body.

---

## Quick Reference: What to Check

### ✅ Dashboard API Response

**URL:** Look in Network tab for `dashboard` or `get-dashboard`  
**Response should include:** `gameSessionId: 1`

### ✅ QR Code URL

**Check:** Input field below QR code displays `/playerlogin?sessionId=1`

### ✅ Player Login URL Parameter

**Check Console:**

```javascript
new URLSearchParams(window.location.search).get("sessionId");
// Should return: "1"
```

### ✅ Player Join API Request

**URL:** Look in Network tab for `/auth/player` or `/api/auth/player`  
**Request Body should include:** `"gameSessionId": 1`  
**Response Status:** Should be `200` or `201`

### ✅ Console for Errors

**Check:** No red error messages in Console tab

---

## Troubleshooting Using DevTools

### Issue: QR Code shows sessionId=undefined

**Debug Steps:**

1. Network tab → Find dashboard API call
2. Click it → Response tab
3. Search for "gameSessionId"
4. If not found → Backend needs to return it

### Issue: Player join fails

**Debug Steps:**

1. Network tab → Find `/api/auth/player` request
2. Click "Request" tab → Check body includes gameSessionId
3. Click "Response" tab → Check error message
4. Look in Console for JavaScript errors

### Issue: Player login page doesn't load

**Debug Steps:**

1. Check URL has `?sessionId=1` in address bar
2. Check Console for JavaScript errors
3. Check Network tab for 404 or other error status
4. Clear browser cache (Ctrl + Shift + Delete)

---

## Developer Tools Keyboard Shortcuts

| Action        | Windows      | Mac          |
| ------------- | ------------ | ------------ |
| Open DevTools | F12          | Cmd+Option+I |
| Open Console  | Ctrl+Shift+J | Cmd+Option+J |
| Open Network  | Ctrl+Shift+E | Cmd+Option+E |
| Clear Console | Ctrl+L       | Cmd+K        |
| Reload Page   | F5           | Cmd+R        |
| Hard Reload   | Ctrl+F5      | Cmd+Shift+R  |

---

## Advanced Debugging

### Monitor State Changes

```javascript
// If using localStorage for auth state:
const observer = () => {
  const state = localStorage.getItem("authState");
  console.log("Auth state changed:", JSON.parse(state));
};

window.addEventListener("storage", observer);
```

### Inspect API Response Timing

```javascript
// See how long API calls take
const startTime = performance.now();
// Make API call...
fetch('/api/auth/player', {...})
  .then(r => {
    const endTime = performance.now();
    console.log(`API took ${endTime - startTime}ms`);
  });
```

### Check DOM Elements

```javascript
// Check if QR code dialog exists
const qrDialog = document.querySelector('[role="dialog"]');
console.log("QR Dialog exists:", !!qrDialog);

// Check URL input field
const urlInput = document.querySelector("input[readonly]");
console.log("URL Field exists:", !!urlInput);
console.log("URL Value:", urlInput?.value);
```

---

## Recording a Bug Report with DevTools

When reporting issues, include:

1. **Network Tab Screenshot**

   - Show API request/response
   - Include status code

2. **Console Screenshot**

   - Show any red errors

3. **Steps to Reproduce**

   - Which button clicked
   - What URL navigated to
   - What data entered

4. **Expected vs Actual**
   - What should happen
   - What actually happened

---

**Happy Testing!** 🚀

For more details, see `docs/TESTING_GUIDE.md` and `docs/QUICK_TEST_CHECKLIST.md`
