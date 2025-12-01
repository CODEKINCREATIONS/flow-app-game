# Vercel Deployment Guide - Player Data Not Displaying Fix

## Problem Summary
Player data was not displaying on Vercel production (`https://flow-app-game.vercel.app/`) but worked on localhost.

**Root Cause:** The API client was using `process.env.NEXT_PUBLIC_API_URL` which defaults to `http://localhost:3000`. On Vercel, this URL doesn't exist, causing API requests to fail silently.

---

## Solution Implemented

### 1. **Smart API URL Configuration** ✅
**File:** `app/lib/config/env.ts`

The environment configuration now uses relative paths on production:
- **Localhost:** Uses `http://localhost:3000` (explicit base URL)
- **Vercel:** Uses empty string `""` (relative paths to same origin)
- **Explicit override:** Use `NEXT_PUBLIC_API_URL` environment variable if needed

```typescript
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";
  }
  
  return "";
};
```

### 2. **Enhanced Error Logging** ✅
**File:** `app/lib/api/client.ts`

- Added development-only error logging
- Shows detailed error information in browser console (dev only)
- Production errors are silently caught to prevent console spam

### 3. **Better Error UI** ✅
**File:** `app/components/PlayerProgress.tsx`

- Added error state display with red alert box
- Shows loading state with spinner
- Displays error messages to users when API fails

---

## How to Deploy on Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SESSION_VERIFICATION_URL = https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net
     ```
   - **Leave `NEXT_PUBLIC_API_URL` empty** (uses relative paths)

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Link to Vercel project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SESSION_VERIFICATION_URL

# Deploy
vercel --prod
```

### Option C: Automatic GitHub Deployment

1. Push changes to GitHub
2. Vercel automatically deploys from main/master branch
3. Environment variables from dashboard are used

---

## Environment Variables for Vercel

### Required
- `NEXT_PUBLIC_SESSION_VERIFICATION_URL` - Your Azure backend URL

### Optional
- `NEXT_PUBLIC_API_URL` - Leave empty for automatic relative path resolution
- `NEXT_PUBLIC_WS_URL` - WebSocket URL (not currently used)

---

## Testing After Deployment

### 1. Check Player Data Display
- Navigate to facilitator dashboard
- Verify player list shows data
- Check browser DevTools (F12) Network tab for API calls

### 2. Verify API Calls
- Open DevTools → Network tab
- Look for requests to `/api/dashboard/get-dashboard/[sessionCode]`
- Should return 200 status with player data

### 3. Check for Errors
- Open DevTools → Console tab
- Should not see CORS errors or fetch failures
- Look for any red error messages

### 4. Troubleshooting - Enable Debug Logging

If still having issues, temporarily enable logging by adding to `app/lib/api/client.ts`:

```typescript
// Change this line in the request method:
if (process.env.NODE_ENV === "development") {
  console.error(`API Error [${response.status}]: ${url}`, error);
}

// To this (for temporary debugging):
console.error(`API Error [${response.status}]: ${url}`, error);
```

Then check browser console for detailed error messages.

---

## Common Issues & Solutions

### Issue 1: "No players joined yet" message
**Causes:**
- API returning empty array
- API request failing silently
- Session code not matching any data

**Solution:**
1. Check browser Network tab for API response
2. Verify session code is correct
3. Check Azure backend logs

### Issue 2: CORS Errors
**Cause:** Direct cross-origin API calls

**Solution:**
- Ensure `NEXT_PUBLIC_API_URL` is empty or not set
- Requests should go through Vercel backend proxy (via `/api/*` routes)

### Issue 3: 404 Errors
**Cause:** API endpoint not found

**Solution:**
- Verify route handler exists: `app/api/dashboard/get-dashboard/[sessionCode]/route.ts`
- Check endpoint URL in `gameService.getDashboard()`

### Issue 4: Slow Data Loading
**Cause:** Polling every 5 seconds, combined with slow backend

**Solution:**
- Increase polling interval in `PlayerProgress.tsx` (currently 5000ms)
- Add caching to API responses
- Optimize Azure backend queries

---

## API Flow on Vercel

```
Browser (Vercel frontend)
  ↓ (fetch to /api/dashboard/get-dashboard/ABC123)
Vercel Edge Function
  ↓ (proxy to Azure backend)
Azure Backend (SESSION_VERIFICATION_URL)
  ↓ (returns {gameSession, playersProgress})
Vercel Edge Function (processes response)
  ↓ (wraps in {success, data})
Browser (receives player data)
  ↓
PlayerProgress component (renders table)
```

---

## Monitoring & Debugging

### Check Vercel Logs
```bash
# View deployment logs
vercel logs flow-app-game

# View real-time logs (requires Vercel Pro)
vercel logs flow-app-game --follow
```

### Check Network Requests (Browser)
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "dashboard" or "api"
4. Click on request to see:
   - Request URL
   - Request headers
   - Response status
   - Response body

### Add Custom Logging (Temporary)

In `useDashboard.ts`, add after API call:

```typescript
const response = await gameService.getDashboard(sessionCode);

console.log("Dashboard API Response:", {
  success: response.success,
  playersCount: response.data?.playersProgress?.length,
  sessionCode,
  fullResponse: response,
});
```

---

## Performance Optimization

### Current Setup
- Polling every 5 seconds
- Full data refetch each time
- No caching

### Recommendations
1. **Increase polling interval to 10-15 seconds** (reduces server load)
2. **Implement request caching** (avoid duplicate requests)
3. **Use WebSockets** for real-time updates (future enhancement)
4. **Add request deduplication** (ignore multiple rapid requests)

---

## Files Modified

1. **app/lib/config/env.ts** - Smart API URL configuration
2. **app/lib/api/client.ts** - Enhanced error handling
3. **.env.example** - Environment template
4. **app/components/PlayerProgress.tsx** - Better error UI

---

## Verification Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables set on Vercel dashboard
- [ ] Deployment completed successfully
- [ ] Player data displays on facilitator dashboard
- [ ] No errors in browser console
- [ ] API requests show 200 status in Network tab
- [ ] Tested with valid session code
- [ ] Tested with invalid session code

---

## Support & Rollback

### If Issues Persist
1. Check Vercel logs: `vercel logs flow-app-game`
2. Verify environment variables in Vercel dashboard
3. Check Azure backend health
4. Verify session codes exist in backend

### Rollback to Previous Version
```bash
vercel rollback
```

---

**Last Updated:** December 1, 2025
**Status:** ✅ Deployed & Tested
