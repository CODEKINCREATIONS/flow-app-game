# Quick Testing Checklist - GameSessionId QR Code

## 🚀 5-Minute Quick Test

Use this for rapid validation of the integration.

### Step 1: Start Frontend (30 seconds)

```powershell
npm run dev
```

- Wait for "ready - started server on 0.0.0.0:3000"
- Backend accessible at: `http://localhost:3000`

### Step 2: Facilitator Dashboard (1 minute)

- [ ] Navigate to facilitator dashboard
- [ ] Login successfully
- [ ] Dashboard loads with session data
- [ ] No errors in console (F12)

### Step 3: Unlock Session (1 minute)

- [ ] Click "Unlock Session for Players"
- [ ] Confirm unlock dialog
- [ ] Session status changes to unlocked

### Step 4: Generate QR Code (1 minute)

- [ ] Click "QR Code" button
- [ ] QR code dialog appears
- [ ] Check the link field below QR code
- [ ] Verify it shows: `/playerlogin?sessionId=1` (or your session ID)

**KEY CHECK:** The link should look like:

```
https://yourdomain.com/playerlogin?sessionId=1
NOT
https://yourdomain.com/player?session=SHI-HDS-XkkKi
```

### Step 5: Copy and Test URL (1 minute)

- [ ] Click copy button (📋) next to link
- [ ] Paste link in new browser tab
- [ ] Player login page should load
- [ ] Form should display: Name, Email, Language fields

### Step 6: Join as Player (1 minute)

- [ ] Fill form:
  - Name: "Test Player"
  - Email: "test@example.com"
  - Language: "EN"
- [ ] Click "Join Game"
- [ ] Check for success or error message

---

## 🔍 What to Look For

### ✅ Signs It's Working

- QR code displays without errors
- Link shows `/playerlogin?sessionId={number}`
- Number matches the gameSessionId from dashboard
- Player login page loads correctly
- Form submits without errors
- Player appears in facilitator's player list

### ❌ Signs Something's Wrong

- QR code doesn't appear
- Link shows `sessionId=undefined` or `sessionId=NaN`
- Link uses old format `/player?session=...`
- Player login page 404s
- Form submission shows error
- Console shows JavaScript errors
- Player doesn't appear in player list

---

## 📱 Using DevTools Network Tab

**Quick Check for API Success:**

1. Open DevTools (F12)
2. Click "Network" tab
3. Clear previous requests (trash icon)
4. Unlock session → Should see API call
5. Copy URL and navigate → Should see GET request
6. Submit player form → Should see POST `/api/auth/player` request

**Each request should show:**

- Status: `200` (green) or `201`
- NOT `404`, `500`, or `error` (red)

---

## 🧪 Testing Commands

### Test 1: Check Console for Errors

After each action, open Console (F12) and verify no red errors appear.

### Test 2: Check Network Requests

1. Network tab (F12)
2. Filter: "Fetch/XHR"
3. Look for requests containing:
   - `dashboard` → Check response includes `gameSessionId`
   - `auth/player` → Check body includes `gameSessionId`

### Test 3: Verify URL Parameter

After player login page loads:

```javascript
// In browser console:
new URLSearchParams(window.location.search).get("sessionId");
// Should return: "1" (or your session ID as string)
```

---

## 📋 One-Page Summary

| Step              | Expected Result            | Pass? |
| ----------------- | -------------------------- | ----- |
| Dashboard loads   | No errors                  | ☐     |
| Unlock session    | State changes              | ☐     |
| Click QR Code     | Dialog appears             | ☐     |
| Check URL format  | `/playerlogin?sessionId=1` | ☐     |
| Copy link         | URL copied                 | ☐     |
| Navigate to URL   | Login page loads           | ☐     |
| Fill form         | No validation errors       | ☐     |
| Submit form       | API call succeeds          | ☐     |
| Check player list | New player appears         | ☐     |
| Check console     | No errors                  | ☐     |

---

## 🎯 Success Criteria

**PASS if:**

- QR code URL shows: `/playerlogin?sessionId={number}`
- Player successfully joins session
- Facilitator sees new player in list
- No console errors
- All API calls return status 200

**FAIL if:**

- Any of the above are NOT true
- Console shows red errors
- API returns error status (400, 404, 500, etc.)

---

## 💡 Common Issues & Quick Fixes

| Issue                 | Quick Fix                               |
| --------------------- | --------------------------------------- |
| sessionId=undefined   | Check if backend returns gameSessionId  |
| sessionId=NaN         | Check if dashboard data is numeric      |
| URL uses old format   | Check if QRCodeDialog updated correctly |
| Form submission fails | Check Network tab for API error message |
| Player doesn't join   | Check if backend receives gameSessionId |

---

## 📊 Test Data Template

Save this while testing:

```
Test Date: _______________
Session ID: _______________

QR Code URL: ____________________________________

Frontend Status:
- Dashboard loads: ☐ Yes ☐ No
- QR Code displays: ☐ Yes ☐ No
- URL format correct: ☐ Yes ☐ No

Player Join:
- Form submits: ☐ Yes ☐ No
- API succeeds: ☐ Yes ☐ No
- Player in list: ☐ Yes ☐ No

Console Errors: ___________________________________

Notes: __________________________________________
```

---

**For detailed testing:** See `docs/TESTING_GUIDE.md`  
**For complete flow:** See `docs/QR_CODE_VISUAL_GUIDE.md`
