# Lock Image Paths Update - Summary

## Overview

Updated all lock modal components and lock configuration file to use the correct image paths from `public/assets/locks/` directory.

## Files Modified

### 1. **NumericV1Modal.tsx** (app/components/)

- **Lock Image**: `/assets/locks/NumericV1-Locked.png`
- **Unlock Image**: `/assets/locks/NumericV1-Unlocked.png`

### 2. **NumericV2Modal.tsx** (app/components/)

- **Unlock Image**: `/assets/locks/NumericV2-Unlocked.png`
- (Lock image passed as prop from lockConfig)

### 3. **WordLockModal.tsx** (app/components/)

- **Lock Image**: `/assets/locks/WordLock-locked.png`
- **Unlock Image**: `/assets/locks/WordLock-unlocked.png`

### 4. **WordMLModal.tsx** (app/components/)

- **Lock Image**: `/assets/locks/WordMLLock-locked.png`
- **Unlock Image**: `/assets/locks/WordMLLock-unlocked.png`

### 5. **lockConfig.ts** (app/lib/config/)

#### NumericV1 Locks (Boxes 7, 8, 13, 15)

- Image: `/assets/locks/NumericV1-Locked.png`

#### Word Lock (Box 9)

- Image: `/assets/locks/WordLock-locked.png`

#### NumericV2 Locks (Boxes 10, 11, 12, 14)

- Image: `/assets/locks/NumericV2-Locked.png`

#### WordML Lock (Box 16)

- Image: `/assets/locks/WordMLLock-locked.png`

## Image Files Available in public/assets/locks/

All the following lock image files are now being used:

- ✅ NumericV1-Locked.png
- ✅ NumericV1-Unlocked.png
- ✅ NumericV2-Locked.png
- ✅ NumericV2-Unlocked.png
- ✅ WordLock-locked.png
- ✅ WordLock-unlocked.png
- ✅ WordMLLock-locked.png
- ✅ WordMLLock-unlocked.png

## Additional Files (Unchanged)

- Directional locks continue to use: `/assets/locks/Directional_up_down_red.png` and `/assets/locks/Directional-unlocked.png`
- Numeric locks (standard) continue to use: `/assets/locks/NumericLock.png` and `/assets/locks/NumericLock-unlocked.png`

## Changes Summary

- Fixed 5 files with hardcoded image paths
- Updated 1 main configuration file (lockConfig.ts) with 4 lock types
- All image paths now follow consistent naming convention: `{LockType}-locked.png` and `{LockType}-unlocked.png`
- No functional changes to lock behavior, only image path corrections
