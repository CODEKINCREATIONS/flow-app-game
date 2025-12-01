# Quick Testing Guide - Vercel Deployment

## ✅ What Was Fixed

Your Vercel deployment now has:
1. **Smart API URL routing** - Uses relative paths on Vercel, localhost URLs on local dev
2. **Better error handling** - Shows error messages instead of silent failures
3. **Loading states** - Displays loading indicator while fetching data
4. **Error UI** - Red alert box when API calls fail

---

## 🧪 Testing Steps

### Step 1: Visit Your Deployed App
```
https://flow-app-game.vercel.app/facilitator-dashboard?sessionCode=YOUR_SESSION_CODE
```

Replace `YOUR_SESSION_CODE` with an actual session code from your backend.

### Step 2: Check Player Data
- ✅ Player table should show:
  - Player names
  - Active box number
  - Attempt count
  - Solved status
- ✅ Players should update every 5 seconds (polling)

### Step 3: Browser DevTools Check (F12)

#### Network Tab
1. Open DevTools → **Network** tab
2. Refresh the page
3. Look for requests with "dashboard" in the name
4. Click on the request and verify:
   - **Status:** 200 (not 4xx or 5xx)
   - **Response:** Shows `{success: true, data: {...}}`

#### Console Tab
1. Open DevTools → **Console** tab
2. Should see **NO red errors**
3. If errors appear, copy them and investigate

---

## 🔍 Expected Behavior

### ✅ Success Case (Data Showing)
```
1. Page loads
2. "Loading player data..." spinner shows briefly
3. Player table appears with real data
4. Data updates every 5 seconds (no refresh needed)
5. Console has no errors
6. Network shows 200 status for API calls
```

### ❌ Failure Case (Data Not Showing)
```
1. Page loads
2. Error message: "Error loading player data: [error details]"
3. Check console for specific error
4. Network tab shows:
   - 404: API route not found
   - 500: Backend error
   - Failed: Network/CORS issue
   - Timeout: Backend is slow/offline
```

---

## 🛠️ Troubleshooting

### Issue 1: "No players joined yet"
**Check:**
- Is the session code in the URL valid?
- Does that session exist in your backend?
- Are there actually players in that session?

**Test with:** Try a different known-good session code

---

### Issue 2: Red Error Box Appears
**Shows:** "Error loading player data: [details]"

**Check Network Tab for:**

| Status | Meaning | Fix |
|--------|---------|-----|
| 404 | API route missing | Check if `/api/dashboard/get-dashboard/[sessionCode]/route.ts` exists |
| 500 | Backend error | Check Azure backend logs |
| CORS | Cross-origin blocked | Should be using relative paths (leave `NEXT_PUBLIC_API_URL` empty) |
| Network Error | Connection failed | Check if Vercel can reach Azure backend |

---

### Issue 3: Players Show but Don't Update
**Cause:** Polling is broken or API is returning same data

**Check:**
- Are you waiting 5 seconds between page refreshes?
- Watch Network tab to see if requests continue
- If requests stopped, polling broke

---

## 📊 API Call Flow on Vercel

```
Browser Request:
GET https://flow-app-game.vercel.app/api/dashboard/get-dashboard/ABC123
         ↓
Vercel API Route Handler:
(app/api/dashboard/get-dashboard/[sessionCode]/route.ts)
         ↓
Azure Backend:
GET https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net
    /Dashboard/GetDashboard/ABC123
         ↓
Response: {gameSession: {...}, playersProgress: [...]}
         ↓
Next.js Wrapper: {success: true, data: {...}}
         ↓
Browser: Player table updates
```

---

## 🚀 Verify Deployment Status

### Check if Latest Code is Deployed
1. Go to https://vercel.com/projects
2. Find your project: **flow-app-game**
3. Check **Latest Deployment**:
   - Status should be ✅ **Ready**
   - Time should be recent

### View Deployment Logs
```bash
# In terminal (requires Vercel CLI installed)
vercel logs flow-app-game

# Or in Vercel dashboard:
# Project → Deployments → Click latest → View logs
```

---

## 💾 Environment Variables Verification

On Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Verify:
   - ✅ `NEXT_PUBLIC_SESSION_VERIFICATION_URL` is set correctly
   - ✅ `NEXT_PUBLIC_API_URL` is **empty** (or not set)

---

## 📝 Manual Testing Checklist

- [ ] Page loads without errors
- [ ] Player table appears
- [ ] Player names display correctly
- [ ] Active box number shows
- [ ] Attempt count shows
- [ ] Solved status shows
- [ ] "View" button works
- [ ] Data updates every 5 seconds
- [ ] No errors in console
- [ ] Network requests show 200 status
- [ ] Error message appears for bad session code

---

## 🐛 If Still Not Working

### Step 1: Enable Debug Logging
Add to `app/lib/api/client.ts` temporarily:

```typescript
// Find this line:
if (process.env.NODE_ENV === "development") {

// Change to always log:
if (true) {  // Temporary - remove after debugging
```

Then redeploy and check console for detailed errors.

### Step 2: Check Azure Backend
```bash
# Test backend directly (replace ABC123 with real session code)
curl "https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net/Dashboard/GetDashboard/ABC123"
```

Should return JSON with player data.

### Step 3: Check API Route Directly
```bash
# Test Vercel API route (replace ABC123 with real session code)
curl "https://flow-app-game.vercel.app/api/dashboard/get-dashboard/ABC123"
```

Should also return player data.

### Step 4: Collect Diagnostic Info
Share this information:
1. Browser console errors (screenshot)
2. Network tab response (screenshot)
3. Network tab request headers (screenshot)
4. What session code you're using
5. Whether it works on localhost

---

## ✨ Success Indicators

✅ **You'll know it's working when:**

1. Player data table has names in it
2. No red error boxes
3. Data refreshes automatically every 5 seconds
4. Browser console shows no errors
5. Network requests all return 200 status

---

**Last Updated:** December 1, 2025
**Deploy Status:** Ready for Testing
