# Layout System Documentation

## Overview

The Flow App Game now includes a responsive layout system with a global header and footer that wraps all pages.

## Components

### 1. **AppLayout** (`app/components/layout/AppLayout.tsx`)

Main layout wrapper that provides header, content area, and footer.

```typescript
import { AppLayout } from "@/app/components/layout";

<AppLayout>
  <YourPageContent />
</AppLayout>;
```

### 2. **AppHeader** (`app/components/layout/AppHeader.tsx`)

Responsive header with:

- Logo/Brand navigation
- User authentication status
- Logout button
- Conditional rendering (hides on login pages)

**Features:**

- Sticky positioning
- Mobile-responsive navigation
- Shows user name when logged in
- Login buttons when not authenticated

### 3. **AppFooter** (`app/components/layout/AppFooter.tsx`)

Footer with:

- About section
- Quick links
- Social media links
- Copyright

## Responsive Design

The layout is fully responsive with breakpoints:

- **Mobile**: `< 768px` - Stacked layout, compact header
- **Tablet**: `768px - 1024px` - Two-column footer
- **Desktop**: `> 1024px` - Full three-column footer

### Header Responsive Behavior

```typescript
// Desktop: Shows all navigation and user info
<Logo> [Nav Links] [User Info] [Logout]

// Mobile: Compresses user info
<Logo> [User Name] [Logout Icon]
```

## Usage

### Basic Page with Layout

```typescript
"use client";
import { AppLayout } from "@/app/components/layout";

export default function MyPage() {
  return (
    <AppLayout>
      <div className="py-8">
        <h1>My Page Content</h1>
      </div>
    </AppLayout>
  );
}
```

### Homepage Example (Color Dashboard)

```typescript
"use client";
import { AppLayout } from "@/app/components/layout";
import ColorDashboard from "@/app/components/ColorDashboard";

export default function HomePage() {
  return (
    <AppLayout>
      <ColorDashboard />
    </AppLayout>
  );
}
```

## Special Cases

### Pages WITHOUT Layout

These pages use full-screen custom layouts:

- `/facilitator-login` - Full screen login
- `/playerlogin` - Full screen login
- `/game` - Game interface with custom header
- `/facilitator-dashboard` - Dashboard interface

These pages have their own `min-h-screen` wrappers.

## Header Behavior

The `AppHeader` component automatically:

1. **Hides on login pages** - Won't render on `/facilitator-login` or `/playerlogin`
2. **Shows user info** - Displays name when authenticated
3. **Shows login buttons** - Shows Facilitator/Player buttons when not logged in
4. **Handles logout** - Logs out and redirects to home

## Styling

All layout components use Tailwind CSS with your design system:

```css
/* Header */
Background: bg-[#0F1125]
Border: border-gray-800
Text: text-white

/* Footer */
Background: bg-[#1A1C25]
Links: hover:text-[#7B61FF]

/* Navigation Active State */
Active: text-[#7B61FF]
Hover: hover:text-[#7B61FF]
```

## Customization

### Modify Header

Edit `app/components/layout/AppHeader.tsx`:

- Add navigation links in the `<nav>` section
- Modify user display logic
- Add additional buttons

### Modify Footer

Edit `app/components/layout/AppFooter.tsx`:

- Update quick links
- Change social media links
- Modify copyright text

## Best Practices

1. **Always wrap content** with AppLayout for consistent structure
2. **Don't add `min-h-screen`** to pages that use AppLayout
3. **Use responsive classes** like `sm:`, `md:`, `lg:` for breakpoints
4. **Keep login pages** separate as they need custom full-screen layouts

## File Structure

```
app/components/layout/
├── AppLayout.tsx      # Main layout wrapper
├── AppHeader.tsx      # Header component
├── AppFooter.tsx      # Footer component
├── LayoutWrapper.tsx  # Conditional wrapper (for future use)
└── index.ts           # Barrel exports
```

## Responsive Breakpoints Reference

- `sm`: 640px and up (mobile landscape)
- `md`: 768px and up (tablets)
- `lg`: 1024px and up (desktops)
- `xl`: 1280px and up (large desktops)

## Example: Creating a New Page

```typescript
"use client";
import { AppLayout } from "@/app/components/layout";

export default function NewPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold">Page Title</h1>
        <p className="mt-4">Your content here</p>
      </div>
    </AppLayout>
  );
}
```

## Testing

Test the layout across different screen sizes:

- Mobile (375px - iPhone)
- Tablet (768px - iPad)
- Desktop (1024px+)

Use Chrome DevTools or browser extensions to test responsive design.
