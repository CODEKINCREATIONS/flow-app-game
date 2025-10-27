# Responsive Padding Documentation

## Overview

The `AppHeader` component now features fully responsive padding that adapts to different screen sizes for optimal user experience.

## Responsive Breakpoints

### Tailwind CSS Breakpoints Used:

- **Mobile**: Default (< 640px)
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up

## Padding Structure by Mode

### 1. **Game Mode Header** 🎮

#### Horizontal Padding (px):

- Mobile: `px-3` (12px)
- Small: `px-4` (16px)
- Medium: `px-6` (24px)

#### Vertical Padding (py):

- Mobile: `py-3` (12px)
- Small: `py-4` (16px)

#### Grid Gap:

- Mobile: `gap-2` (8px)
- Small: `gap-3` (12px)
- Medium: `gap-4` (16px)

**Player Name Font Size:**

```css
text-base      /* Mobile: 16px */
sm:text-xl     /* Small: 20px */
md:text-2xl     /* Medium: 24px */
lg:text-3xl     /* Large: 30px */
```

### 2. **Dashboard Mode Header** 📊

#### Horizontal Padding (px):

- Mobile: `px-3` (12px)
- Small: `px-4` (16px)
- Medium: `px-6` (24px)
- Large: `px-8` (32px)

#### Vertical Padding (py):

- Mobile: `py-3` (12px)
- Small: `py-4` (16px)

#### Layout:

- Mobile: Column layout (`flex-col`)
- Small+: Row layout (`flex-row`)

**Dashboard Title Font Size:**

```css
text-xl      /* Mobile: 20px */
sm:text-2xl   /* Small: 24px */
md:text-3xl   /* Medium: 30px */
```

### 3. **Default Mode Header** 🏠

#### Horizontal Padding (px):

- Mobile: `px-3` (12px)
- Small: `px-4` (16px)
- Medium: `px-6` (24px)
- Large: `px-8` (32px)

#### Vertical Padding (py):

- Mobile: `py-3` (12px)
- Small: `py-4` (16px)

#### Minimum Height:

- Mobile: `min-h-[48px]`
- Small: `min-h-[56px]`
- Medium: `min-h-[64px]`

**Logo Font Size:**

```css
text-xl      /* Mobile: 20px */
sm:text-2xl   /* Small: 24px */
md:text-3xl   /* Medium: 30px */
```

## Component-Specific Responsive Elements

### Timer Display

**Icon Size:**

- Mobile: `w-3 h-3` (12px)
- Small: `w-4 h-4` (16px)
- Medium+: `w-5 h-5` (20px)

**Font Size:**

- Mobile: `text-xs` (12px)
- Small: `text-sm` (14px)
- Medium: `text-base` (16px)
- Large: `text-lg` (18px)

**Padding:**

- Mobile: `px-2 py-1.5 gap-1`
- Small: `px-3 py-2 gap-2`
- Medium+: `px-4 py-2 gap-2`

### Language Selector

**Padding:**

- Mobile: `px-2 py-1.5 text-xs`
- Small: `px-3 py-2 text-sm`
- Medium+: `px-5 py-2 text-sm`

### Buttons

**Padding:**

- Mobile: `!px-2 !py-1 !text-xs`
- Small: `!px-3 !py-1.5 !text-sm`
- Medium+: `!px-4 !py-2 !text-sm`

**Icon Sizes:**

- Mobile: `w-3 h-3`
- Small+: `w-4 h-4`

## Responsive Spacing

### Element Spacing (space-x)

**Mobile:**

- Actions: `space-x-1` (4px)
- Buttons: `space-x-2` (8px)

**Small:**

- Actions: `space-x-2` (8px)
- Buttons: `space-x-3` (12px)

**Medium+:**

- Actions: `space-x-3` (12px)
- Buttons: `space-x-4` (16px)

## Mobile-First Optimization

### Dashboard Mode

- **Mobile**: Stacks elements vertically
  - Title on top
  - Actions below
  - Full width
- **Tablet+**: Horizontal layout
  - Title left, actions right
  - Side-by-side

### Button Text

- **Mobile**: Abbreviated text ("Facil")
- **Small+**: Full text ("Facilitator")
- **Hide text**: Show only icon on very small screens

## Visual Examples

### Mobile (< 640px)

```
┌─────────────────────────────┐
│ FLOW           [Logout]     │  ← Compact
├─────────────────────────────┤
│ Header padding: 12px       │
│ Font: 16-20px               │
└─────────────────────────────┘
```

### Tablet (768px+)

```
┌──────────────────────────────────────┐
│ FLOW    Home    [User] [Logout]     │
├──────────────────────────────────────┤
│ Header padding: 16-24px              │
│ Font: 24-30px                        │
└──────────────────────────────────────┘
```

### Desktop (1024px+)

```
┌─────────────────────────────────────────────┐
│    FLOW          Home    [User] [Logout]    │
├─────────────────────────────────────────────┤
│ Header padding: 32px                        │
│ Font: 30px                                   │
└─────────────────────────────────────────────┘
```

## Testing Recommendations

### Breakpoints to Test:

1. **320px** - iPhone SE
2. **375px** - iPhone 12/13
3. **768px** - iPad
4. **1024px** - Desktop
5. **1280px+** - Large desktop

### What to Check:

- ✅ Padding doesn't cause overflow
- ✅ Text is readable at all sizes
- ✅ Buttons are touch-friendly (min 44px tap target)
- ✅ Elements don't overlap
- ✅ Navigation is accessible

## CSS Customization

If you need to adjust padding, edit the classes in `app/components/layout/AppHeader.tsx`:

```typescript
// Example: Increase mobile padding
<div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5">
  {/* content */}
</div>

// Example: Adjust minimum height
<div className="min-h-[56px] sm:min-h-[64px] md:min-h-[72px]">
  {/* content */}
</div>
```

## Benefits of Responsive Padding

1. **Better Mobile UX** - Adequate spacing on small screens
2. **Improved Readability** - Proportional text sizing
3. **Touch-Friendly** - Sufficient tap targets
4. **Professional Look** - Polished across all devices
5. **Performance** - CSS-only, no JavaScript

## Browser Compatibility

All responsive classes use Tailwind CSS defaults, compatible with:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
