# Password-Protected Video Dialog Implementation

## Overview

A password-protected video dialog has been implemented for the game page. When users click the "Watch Video" button, they must enter a password to access the video content.

## Features

### 1. **Two-Stage Dialog**

- **Password Stage**: Users enter a password
- **Video Stage**: Once authenticated, users see the embedded video player

### 2. **Password Protection**

- Simple password validation
- Error messages for incorrect passwords
- Clear feedback to users

### 3. **Video Player Support**

- **YouTube**: Automatically detects YouTube URLs and embeds them via iframe
- **MP4/Video Files**: Supports direct video file URLs with HTML5 video player
- Full-screen capability
- Play controls

### 4. **User Experience**

- Show/Hide password toggle button
- Enter key support for password submission
- Responsive design using Tailwind CSS
- Smooth animations with Framer Motion
- Clean, modern UI matching the app's design language

## Files Created

### `app/components/VideoDialog.tsx`

Main component file containing:

- Password input stage with validation
- Video player stage
- Support for YouTube and MP4 videos
- Error handling and user feedback

## Files Modified

### `app/game/page.tsx`

Updated to:

- Import the `VideoDialog` component
- Add state for showing/hiding the dialog
- Configure video password and URL
- Handle the "Watch Video" button click

## Configuration

### Setting the Password

Edit `app/game/page.tsx` and change:

```tsx
const VIDEO_PASSWORD = "1234"; // Change this to your desired password
```

### Setting the Video URL

Edit `app/game/page.tsx` and change:

```tsx
const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Replace with your video URL
```

#### YouTube URL Format

Use the embed URL format:

```
https://www.youtube.com/embed/VIDEO_ID
```

To get the VIDEO_ID from a YouTube URL like `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, extract the `dQw4w9WgXcQ` part.

#### MP4 URL Format

Use a direct link to an MP4 file:

```
https://example.com/path/to/video.mp4
/videos/myvideo.mp4
```

## Component API

```tsx
interface VideoDialogProps {
  open: boolean; // Whether the dialog is visible
  onClose: () => void; // Callback when dialog is closed
  videoUrl: string; // URL to the video (YouTube embed or MP4)
  password: string; // Password required to access the video
}
```

## Usage Example

```tsx
import VideoDialog from "@/app/components/VideoDialog";

function MyComponent() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <button onClick={() => setShowVideo(true)}>Watch Video</button>

      <VideoDialog
        open={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl="https://www.youtube.com/embed/VIDEO_ID"
        password="mypassword"
      />
    </>
  );
}
```

## Dialog Flow

```
User clicks "Watch Video" button
          ↓
VideoDialog opens with password stage
          ↓
User enters password and clicks "Submit"
          ↓
    Does password match?
    ↙          ↘
  NO            YES
   ↓             ↓
Show error    Show video player
message       with controls
   ↓             ↓
Wait for     User can watch,
retry        fullscreen, etc.
             ↓
          User clicks "Close"
             ↓
      Dialog closes & resets
```

## Styling

The component uses:

- **Color Scheme**: Matches existing app design (#12142A, #7B61FF, #3A8DFF)
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-friendly with Tailwind CSS breakpoints
- **Accessibility**: Keyboard support (Enter to submit, Escape to close)

## Keyboard Shortcuts

- **Enter**: Submit password
- **Escape**: Close dialog
- **Click Eye Icon**: Toggle password visibility

## Security Notes

⚠️ **Important**: This is client-side password protection. The password is visible in the code and should NOT be used for sensitive content. For production use with sensitive videos:

1. Move password to environment variables
2. Implement server-side validation
3. Use secure authentication mechanisms
4. Consider using JWT tokens or session-based authentication

## Customization

### Change Dialog Title

In `VideoDialog.tsx`, update:

```tsx
<span className="text-2xl font-bold text-center text-white block">
  Enter Password
</span>
```

### Change Placeholder Text

In `VideoDialog.tsx`, update:

```tsx
placeholder = "Enter password";
```

### Change Button Labels

Update button text in the component JSX

### Change Colors

Update Tailwind classes in `VideoDialog.tsx`:

- `bg-[#12142A]` - Background color
- `border-[#1E2144]` - Border color
- `text-[#7B61FF]` - Primary accent color
- `text-[#3A8DFF]` - Secondary accent color

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with responsive design

## Troubleshooting

### Video doesn't play

- Verify the video URL is correct
- For YouTube, ensure URL is in embed format: `youtube.com/embed/VIDEO_ID`
- Check browser console for CORS or security errors

### Password always wrong

- Verify the password string exactly matches (case-sensitive)
- Check for accidental whitespace

### Dialog doesn't appear

- Ensure `open` prop is `true`
- Check browser console for errors
- Verify VideoDialog is imported correctly

## Future Enhancements

Possible improvements:

- Add password expiration
- Track video watch duration
- Add video playback analytics
- Support for different video sources (Vimeo, etc.)
- Custom error messages
- Retry limits
- Multi-video support
- Video resolution selection
