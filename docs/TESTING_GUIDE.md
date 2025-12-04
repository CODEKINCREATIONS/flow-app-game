# Testing Guide: GameSessionId QR Code & Session Joining API

## Overview

This guide provides step-by-step instructions to test the entire flow from QR code generation to player session joining.

---

## 🔍 Test Environment Setup

### Prerequisites

1. ✅ Backend API is running and accessible
2. ✅ Dashboard API returns `gameSessionId` field
3. ✅ Player registration API accepts `gameSessionId` parameter
4. ✅ Frontend is running: `npm run dev`
5. ✅ Browser developer tools are available (F12)

### Start the Frontend

```powershell
npm run dev
```

Backend should be accessible (usually `localhost:3000` or your configured URL)

---

## 📋 Test Cases

### Test 1: Verify Dashboard Returns gameSessionId

**Steps:**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to Facilitator Dashboard
4. Look for API calls to `get-dashboard` or similar endpoint
5. Click on the request and check the Response

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "gameSession": {
      "gameSessionId": 1,
      "sessionCode": "SHI-HDS-XkkKi",
      "status": 1,
      "sessionUnlocked": true,
      "sessionStarted": "2025-11-11T00:00:00",
      "sessionDuration": 60,
      ...
    },
    "playersProgress": [...]
  }
}
```

**✅ PASS** if:

- Response includes `gameSessionId` field
- Value is a number (not string)
- Value is consistent across multiple API calls

**❌ FAIL** if:

- `gameSessionId` is missing
- Value is null/undefined
- Value is a string instead of number

---

### Test 2: Verify QR Code Dialog Receives gameSessionId

**Steps:**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Unlock the session (click "Unlock Session for Players")
4. Click "QR Code" button
5. In Console, run:

```javascript
// Check if gameSessionId prop was passed
const qrDialog = document.querySelector('[role="dialog"]');
console.log(qrDialog ? "QR Dialog visible" : "QR Dialog not visible");
```

**Better way - Check the URL:**

1. Click "QR Code" button
2. Look for the link field showing the URL
3. It should show: `/playerlogin?sessionId=1` (or your session ID)

**✅ PASS** if:

- QR code displays without errors
- Link shows `/playerlogin?sessionId={number}`
- sessionId is numeric (1, 2, 3, etc.)

**❌ FAIL** if:

- QR code doesn't appear
- Link shows `/playerlogin?sessionId=undefined`
- Link shows old format like `/player?session=CODE`
- sessionId is NaN or null

---

### Test 3: Verify QR Code URL Format

**Steps:**

1. Open QR Code dialog
2. Look at the link field (should be clickable/copyable)
3. Copy the link: Click the copy button (📋)
4. Paste in a text editor and verify format

**Expected URL:**

```
https://yourdomain.com/playerlogin?sessionId=1
```

**✅ PASS** if:

- Format is exactly `/playerlogin?sessionId={number}`
- sessionId is a positive integer
- No special characters in sessionId

**❌ FAIL** if:

- Format includes sessionCode instead
- sessionId has special characters
- URL is malformed or incomplete

---

### Test 4: Test QR Code Scanning (Mobile Device)

**Steps:**

1. Get a mobile device or use mobile emulation (F12 → Device toolbar)
2. Copy the URL from QR code link field
3. Paste into mobile browser address bar
4. OR: Use a QR code scanner app to scan the QR code

**Expected Behavior:**

- Mobile browser navigates to `/playerlogin?sessionId=1`
- Player login form loads
- URL bar shows: `/playerlogin?sessionId=1`

**✅ PASS** if:

- Player login page loads correctly
- URL contains sessionId parameter
- Form fields are visible (Name, Email, Language)

**❌ FAIL** if:

- Page doesn't load
- URL is wrong
- Form doesn't display

---

### Test 5: Verify Player Login Page Reads Query Parameter

**Steps:**

1. Navigate to player login page with sessionId in URL:
   ```
   http://localhost:3000/playerlogin?sessionId=1
   ```
2. Open DevTools Console
3. Fill in player form:
   - Name: Test Player
   - Email: test@example.com
   - Language: English
4. Open Network tab
5. Click "Join Game"
6. Look for the API request to `/api/auth/player`

**Expected Request Body:**

```json
{
  "name": "Test Player",
  "email": "test@example.com",
  "language": "en",
  "gameSessionId": 1
}
```

**✅ PASS** if:

- API request includes `gameSessionId: 1`
- sessionId from URL was parsed and included
- All fields are present in request body

**❌ FAIL** if:

- `gameSessionId` is missing from request
- `gameSessionId` is null/undefined
- sessionId wasn't extracted from URL

---

### Test 6: Test Multiple Sessions (Different gameSessionIds)

**Steps:**

1. Create/unlock Session A (assume gameSessionId=1)
2. View QR code → URL should be `/playerlogin?sessionId=1`
3. Create/unlock Session B (assume gameSessionId=2)
4. View QR code → URL should be `/playerlogin?sessionId=2`
5. Compare the two URLs - they should be different

**✅ PASS** if:

- Each session generates different sessionId in URL
- IDs are sequential or unique numbers
- QR codes are visibly different (encoding different numbers)

**❌ FAIL** if:

- Both sessions generate same URL
- sessionId doesn't change between sessions

---

### Test 7: End-to-End Player Join Test

**Steps:**

**Part A: Facilitator Side**

1. Login as facilitator
2. Navigate to dashboard
3. Click "Unlock Session for Players"
4. Click "QR Code" button
5. Copy the session URL
6. Note the sessionId value

**Part B: Player Side**

1. Open NEW incognito/private browser window
2. Paste the copied URL
3. Fill player form:
   - Name: Player Name
   - Email: player@example.com
   - Language: EN
4. Click "Join Game"

**Part C: Verify**

1. Check Network tab - API request should succeed (200 status)
2. Player should be redirected to game page
3. Back in facilitator window - refresh dashboard
4. Check player list - new player should appear

**✅ PASS** if:

- Player successfully joins
- Player appears in facilitator's player list
- Both are in same session
- No errors in console

**❌ FAIL** if:

- Player sees error message
- API returns 400/500 error
- Player doesn't appear in player list
- Console shows errors

---

## 🛠️ How to Debug

### Check Frontend Logs

**In Browser Console (F12 → Console tab):**

```javascript
// Check what sessionId the player login page extracted
localStorage.getItem("gameSessionId");

// Check auth state
localStorage.getItem("authState");

// Check session context
sessionStorage.getItem("sessionData");
```

### Check Network Requests

**Steps:**

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Perform the action (unlock session, join game, etc.)
5. Look for relevant API calls:
   - `get-dashboard` - should return gameSessionId
   - `auth/player` - should receive gameSessionId
6. Click each request → "Response" tab to see data

**Key API Calls to Monitor:**

| Endpoint                       | Method | Expected Response              |
| ------------------------------ | ------ | ------------------------------ |
| `/api/dashboard/get-dashboard` | GET    | `{gameSessionId: 1, ...}`      |
| `/api/auth/player`             | POST   | `{success: true, data: {...}}` |
| `/api/game/unlock-session`     | POST   | `{success: true, ...}`         |

### Check Browser Console for Errors

**Expected:** No errors when:

- QR code dialog opens
- Player login page loads
- Player submits form
- Session joins successfully

**If you see errors:**

1. Take note of the error message
2. Check if it's a JavaScript error or API error
3. Check the full stack trace in Console

### Check Backend Logs

If frontend looks correct but backend fails:

1. Check your backend API logs
2. Look for the POST request to player registration
3. Verify it includes `gameSessionId`
4. Check if backend properly associates player with session

---

## 📊 Testing Checklist

### Phase 1: Dashboard & QR Code Generation

- [ ] Dashboard loads successfully
- [ ] Dashboard data includes `gameSessionId` field
- [ ] `gameSessionId` is a number, not string
- [ ] Unlock session button works
- [ ] QR Code dialog opens
- [ ] QR code image displays
- [ ] Link field shows `/playerlogin?sessionId={number}`
- [ ] Copy button works
- [ ] Share button works (or shows appropriate message)

### Phase 2: URL & Query Parameters

- [ ] QR code URL is correct format
- [ ] sessionId in URL matches gameSessionId from dashboard
- [ ] URL is accessible from mobile device
- [ ] URL loads player login page
- [ ] Browser address bar shows sessionId parameter

### Phase 3: Player Login

- [ ] Player login page loads with sessionId in URL
- [ ] Form fields display correctly
- [ ] Form validation works
- [ ] Player can submit form
- [ ] API request includes gameSessionId in body
- [ ] sessionId value in request matches URL parameter

### Phase 4: Backend Processing

- [ ] API request succeeds (200 status)
- [ ] Backend finds correct session by gameSessionId
- [ ] Player record is created
- [ ] Player is associated with correct session
- [ ] API returns player data

### Phase 5: Session Confirmation

- [ ] Player is redirected to game page
- [ ] Player sees game content
- [ ] Facilitator dashboard shows new player
- [ ] Player appears in correct session (not different session)
- [ ] No errors in browser console

---

## 🔧 Troubleshooting

### Issue: QR Code Shows sessionId=undefined

**Causes:**

- Dashboard data doesn't include `gameSessionId`
- Backend API changed response structure

**Solution:**

1. Check Network tab → find dashboard API call
2. Open Response tab
3. Verify `gameSessionId` is present
4. Contact backend team if missing

### Issue: Player Doesn't Join Session

**Possible Causes:**

1. Backend not receiving `gameSessionId`
2. Backend not using it to find session
3. Player already exists in session
4. Session doesn't exist for that ID

**Debugging:**

1. Check Network tab - see API request body
2. Verify `gameSessionId` is included
3. Check backend logs for errors
4. Verify session exists for that ID

### Issue: Player Joins Wrong Session

**Likely Cause:**

- Backend logic error in associating player to session

**Check:**

1. Verify sessionId in URL is correct
2. Verify API request includes correct gameSessionId
3. Check backend logs to see which session was assigned

### Issue: Console Shows Errors

**Common Errors:**

| Error                                    | Fix                                     |
| ---------------------------------------- | --------------------------------------- |
| "Cannot read gameSessionId of undefined" | Dashboard data missing gameSessionId    |
| "sessionId is not a number"              | URL has string instead of number        |
| "Failed to login"                        | API error from backend                  |
| "Session not found"                      | Backend can't find session with that ID |

---

## 📈 Performance Testing

### Test Page Load Time

```javascript
// In browser console, navigate to player login page:
console.time("page-load");
// Page loads automatically
// Time will show when ready

// Measure API call time:
console.time("api-call");
// Click "Join Game"
console.timeEnd("api-call");
```

### Test with Multiple Players

1. Open 3 different incognito windows
2. Each scans same QR code
3. Each joins as different player
4. Verify all 3 appear in player list

---

## ✅ Final Verification

**When everything works:**

✅ Dashboard loads with gameSessionId  
✅ QR code displays with correct URL  
✅ QR code URL format: `/playerlogin?sessionId={number}`  
✅ Player scans QR code  
✅ Player login page loads with sessionId in URL  
✅ Player submits form  
✅ API request includes gameSessionId  
✅ Backend finds session and creates player  
✅ Player joins correct session  
✅ Facilitator dashboard shows player  
✅ No errors in console

---

## 📞 Support

If tests fail at any step:

1. Note which test failed
2. Check the expected vs actual values
3. Review the Network tab for API responses
4. Check browser console for errors
5. Contact backend team if API returns errors

**Include in bug report:**

- Which test failed
- Screenshots of Network tab response
- Console error messages
- Steps to reproduce
