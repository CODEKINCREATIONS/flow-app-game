# Video Dialog - Quick Reference

## What Was Added?

A password-protected video player dialog for the game page that:
✅ Shows a password input when "Watch Video" button is clicked
✅ Validates the password
✅ Shows error messages for incorrect passwords
✅ Displays the video player once authenticated
✅ Supports YouTube and MP4 videos
✅ Has Show/Hide password toggle
✅ Is fully responsive and mobile-friendly

## Where to Configure

**File**: `app/game/page.tsx` (lines ~16-17)

```tsx
const VIDEO_PASSWORD = "1234"; // ← Change this
const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // ← Change this
```

## How to Use

### 1. Change the Password

```tsx
const VIDEO_PASSWORD = "your-password-here";
```

### 2. Change the Video

**For YouTube Videos:**

1. Go to YouTube video
2. Copy the video ID from URL: `youtube.com/watch?v=VIDEO_ID_HERE`
3. Update the URL:

```tsx
const VIDEO_URL = "https://www.youtube.com/embed/VIDEO_ID_HERE";
```

**For MP4 Files:**

```tsx
const VIDEO_URL = "https://yourdomain.com/videos/myvideo.mp4";
// or
const VIDEO_URL = "/videos/myvideo.mp4"; // if stored in public folder
```

## Component Locations

- **Dialog Component**: `app/components/VideoDialog.tsx` (newly created)
- **Usage**: `app/game/page.tsx`

## Dialog Workflow

```
User clicks "Watch Video" button
         ↓
Password dialog appears
         ↓
User enters password + clicks Submit
         ↓
       ✓ Correct?
    ↙       ↘
  NO         YES
   ↓         ↓
Error    Video appears
msg      with player
```

## Features in the Dialog

### Password Stage

- Password input field (masked by default)
- Show/Hide toggle button (eye icon)
- Submit button
- Error message display
- Enter key support (press Enter to submit)

### Video Stage

- Full video player with controls
- YouTube: embedded player with all YouTube features
- MP4: HTML5 video player with play/pause/fullscreen
- Close button to exit

## Styling

The component matches your app's design:

- Dark background (#12142A)
- Purple/blue accents (#7B61FF, #3A8DFF)
- Smooth animations
- Mobile responsive

## Keyboard Shortcuts

| Key          | Action             |
| ------------ | ------------------ |
| Enter        | Submit password    |
| Escape       | Close dialog       |
| Click 👁 icon | Show/hide password |

## Example: Change Everything

```tsx
// Before
const VIDEO_PASSWORD = "1234";
const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

// After
const VIDEO_PASSWORD = "mySecurePass123!";
const VIDEO_URL = "https://www.youtube.com/embed/ABC123XYZ";
```

## Mobile Support

✅ Works on phones and tablets
✅ Responsive layout
✅ Touch-friendly buttons
✅ Video player adjusts to screen size

## Security Note

⚠️ The password is visible in the client-side code. This is suitable for:

- Educational content
- Public videos with basic protection
- Internal presentations

For sensitive content, consider server-side authentication.

## Testing

1. Click "Watch Video" button on game page
2. Try wrong password → Should see error message
3. Enter correct password (default: "1234") → Video should play
4. Try fullscreen, play controls
5. Click Close → Dialog should close and reset

## Need Help?

Check the full documentation: `docs/VIDEO_DIALOG_IMPLEMENTATION.md`
