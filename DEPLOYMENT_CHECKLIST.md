# Deployment Checklist - Player Data Fix

## Pre-Deployment

- [ ] All errors cleared: `npm run build` passes without errors
- [ ] No TypeScript errors: `npx tsc --noEmit` passes
- [ ] ESLint passes: `npm run lint` (if configured)
- [ ] Browser testing done locally
- [ ] Tested with valid session code
- [ ] Tested with invalid session code
- [ ] Tested with no players joined
- [ ] Tested with multiple players

## Deployment Steps

### Option 1: Vercel (Recommended)

```bash
# Automatic deployment via git push
git add .
git commit -m "fix: player data display and remove debug logs"
git push origin FLWAPP-005-release-sprint-1

# Or manual deployment
vercel deploy --prod
```

### Option 2: Manual Build & Deploy

```bash
# Build locally
npm run build

# Verify build output
npm run start

# Then deploy the `.next` folder to your hosting
```

## Post-Deployment Verification

### Immediate Checks (within 5 minutes)

1. **Open dashboard URL:**

   - [ ] Navigate to `https://flow-app-game.vercel.app/facilitator-dashboard`
   - [ ] Page loads without errors

2. **Test with valid session:**

   - [ ] Enter session code at `/facilitator-login`
   - [ ] Dashboard loads
   - [ ] No red error boxes appear

3. **Check player display:**

   - [ ] If players exist: Table appears with data
   - [ ] If no players: "No players joined yet" message
   - [ ] Buttons work (QR Code, Unlock Session, Finish Session)

4. **Check console (F12):**
   - [ ] No errors in Console tab
   - [ ] No warnings about missing dependencies
   - [ ] No `console.log` output (should be clean)

### Extended Checks (1-2 hours)

1. **Real-time updates:**

   - [ ] Add a player while dashboard is open
   - [ ] Wait 5 seconds
   - [ ] Verify new player appears without page refresh

2. **Error handling:**

   - [ ] Stop backend temporarily
   - [ ] Watch for error message in red box
   - [ ] Error message is user-friendly
   - [ ] Restart backend
   - [ ] Data recovers after polling retry

3. **Multiple sessions:**
   - [ ] Test with different session codes
   - [ ] Each shows correct players
   - [ ] No cross-contamination

## Rollback Plan

If issues occur, rollback immediately:

```bash
# If using Vercel
vercel rollback

# Or revert git commit
git revert <commit-hash>
git push origin FLWAPP-005-release-sprint-1
```

## Environment Variables Verification

Ensure these are set in production:

```env
NEXT_PUBLIC_API_URL=https://flow-app-game.vercel.app
NEXT_PUBLIC_SESSION_VERIFICATION_URL=https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net
NODE_ENV=production
```

Verify in Vercel Project Settings → Environment Variables

## Monitoring After Deployment

### Check Daily For:

- [ ] No spike in error rates
- [ ] Dashboard loads consistently
- [ ] Player data updates in real-time
- [ ] No performance degradation
- [ ] Error messages are logged properly

### Logs to Watch:

- Vercel Function Logs: `vercel logs`
- Azure Backend Logs: Check Azure Portal
- Browser Console: Check for any client-side errors

## Success Criteria

✅ Deployment successful if:

- Players display correctly in dashboard
- Error messages appear when API fails
- No debug logging in production
- Real-time updates work (5-second polling)
- Fallback endpoint works if primary fails
- App doesn't crash on network errors

## Issues After Deployment?

1. **Check recent changes:**

   ```bash
   git log --oneline -5
   ```

2. **Review error logs:**

   - Vercel Dashboard → Deployments → View Logs
   - Look for API errors or timeouts

3. **Check API responses:**

   - Open DevTools in browser (F12)
   - Check Network tab for failed requests
   - Look for 4xx or 5xx errors

4. **Quick fixes:**
   - Clear browser cache (Ctrl+Shift+Del)
   - Try in incognito/private window
   - Try different session codes

## Files Changed in This Deployment

1. ✅ `app/lib/hooks/useDashboard.ts`

   - Enhanced player data fetching
   - Better error handling
   - Added fallback logic

2. ✅ `app/components/PlayerProgress.tsx`

   - Added error display
   - Added loading state
   - Improved UX

3. ✅ `app/api/dashboard/get-dashboard/[sessionCode]/route.ts`

   - Removed debug logging
   - Production security fix

4. ✅ `app/api/game/players/route.ts`
   - Removed debug logging
   - Production security fix

## Documentation Created

- ✅ `PLAYER_DATA_FIX_SUMMARY.md` - Technical details
- ✅ `PLAYER_DATA_TROUBLESHOOTING.md` - Debug guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - This file

---

**Deployment Date:** ******\_\_\_******  
**Deployed By:** ******\_\_\_******  
**Approved By:** ******\_\_\_******  
**Status:** ⏳ In Progress / ✅ Complete / ❌ Rolled Back

---

**Last Updated:** December 1, 2025
