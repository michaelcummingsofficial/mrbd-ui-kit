# AGENTS.md — AI Coding Assistant Instructions for mrbd-ui-kit

> **Deprecated.** Meta now ships the official design system for Ray-Ban Display as [`@wearables-ui-toolkit/mrbd`](https://www.npmjs.com/package/@wearables-ui-toolkit/mrbd). For a new app, use the toolkit instead of this guide. This package stays installable but receives no further updates. The migration table is in [`README.md`](README.md#migrating-to-the-ui-toolkit-for-meta-ray-ban-display).

You are building a web app for Meta Ray-Ban Display glasses using the `mrbd-ui-kit` component library. Follow these instructions precisely.

## What is Meta Ray-Ban Display?

Meta Ray-Ban Display glasses have a 600×600 pixel monocular additive display projected into the right lens. Web apps are standard HTML/CSS/JS rendered on this display. Input comes from the Meta Neural Band (EMG wrist gestures) and a capacitive touch strip on the glasses temple, both mapped to arrow keys and Enter.

## Critical Display Rules

These are NOT suggestions. Violating them creates a broken experience on the hardware.

### DO:

- Use `<DisplayRoot>` as the outermost wrapper for all MRBD UI
- Add `<meta name="mrbd-web-app-capable" content="yes">` and a `width=600, height=600` viewport to the document head (see Project Setup)
- Use the semantic tokens: `bg-mrbd-surface-1/2/3` for surfaces, `border-mrbd-border` for borders, `text-mrbd-text` for primary text (92% white, NOT pure white), `text-mrbd-text-muted` for labels
- Use the glow utilities for emphasis: `shadow-mrbd-glow` (inner), `shadow-mrbd-glow-ring` (outer ring), `mrbd-glow-stroke` (border stroke)
- Keep navigation in browser history so the Back gesture works. Never add an on-screen Back button (see Navigation and Back)
- Use `font-weight: 500` or higher for all text
- Use `Nunito` (or a fallback like `Noto Sans` for CJK/Thai/etc.) bold sans-serif font (weights 500+)
- Keep layouts right-anchored or F-pattern (display is in the right lens)
- Make all interactive elements spatially navigable via `<Focusable>` or composite components
- Give every `<Focusable>` and `<Button>` a unique `id`
- Keep content glanceable — users scan in <2 seconds
- Use `lucide-react` icons directly in your layouts, or pass them to components (like `<Button>`) that support them
- If needed, you can localize user-facing strings and customize the LoadingSpinner `label` for non-English screen readers

### NEVER:

- Use `#FFFFFF` or `rgb(255,255,255)` — causes ghosting. Use `text-mrbd-text` instead
- Use `drop-shadow` or `box-shadow` for decorative shadows — looks like dirt on lens. Use the glow utilities
- Use `font-weight` below 500 — illegible on additive display
- Use mouse/touch event handlers as primary interaction — use spatial input events
- Create scrollable content without focus management — spatial input can't scroll
- Use heavy animations or frequent re-renders — battery-constrained device

## Project Setup

### Installation

```bash
npm install mrbd-ui-kit
```

### CSS Setup (global.css)

```css
@import "tailwindcss";
@import "mrbd-ui-kit/css";
```

This single import provides Tailwind v4 theme tokens (colors, shadows), focus ring styles, scrollbar hiding, transition defaults, and [`tailwindcss-text-box-trim`](https://www.npmjs.com/package/tailwindcss-text-box-trim) utilities (`box-trim-*`, `box-edge-*`) for pixel-perfect typographic spacing.

### Required meta tags (app/layout.tsx)

```tsx
export const metadata = { other: { "mrbd-web-app-capable": "yes" } };
export const viewport = { width: 600, height: 600, initialScale: 1, userScalable: false };
```

If the app also serves phones or desktops, return the 600×600 viewport only for the glasses using `generateViewport()` and `isMrbdServer()`.

## Architecture

### Import Map

```typescript
// Components + client hooks (has "use client" banner)
import {
  Button,
  Card,
  DisplayRoot,
  Focusable,
  LoadingSpinner,
  Pill,
  ScrollArea,
  ScrollBar,
  ScrollContainer,
  Text,
} from "mrbd-ui-kit";

// Icons — use lucide-react directly
import { Check, Home, Search, Settings } from "lucide-react";

// Hooks
import { useSpatialInput, useFocusManager, usePreferredFocus, useBackNavigation, useIsMrbd, useScroll } from "mrbd-ui-kit";

// Utilities
import { isBackNavigationKey } from "mrbd-ui-kit";

// Server-side device detection (no "use client")
import { isMrbd, isMrbdFromHeaders } from "mrbd-ui-kit/server";

// Next.js RSC device detection (uses next/headers)
import { isMrbdServer } from "mrbd-ui-kit/next";
```

### Component Hierarchy

Every MRBD app must follow this structure:

```tsx
<DisplayRoot>
  {/* Your content */}
</DisplayRoot>
```

## Component Reference

### DisplayRoot

Root wrapper. Required. Sets up the 600×600 viewport, focus engine context, and keyboard event handling.

```tsx
<DisplayRoot
  focusOptions={{ wrap: true }}
  onSelect={(focusedId) => handleAction(focusedId)}
>
  {children}
</DisplayRoot>
```

Props: `children`, `className?`, `focusOptions?: { wrap?: boolean }`, `onSelect?: (id: string) => void`, `onBack?: () => boolean | void` (desktop Back keys; return `false` to fall through to the default `history.back()`), `focusGlow?: boolean` (default `true`, one glow ring that travels between focused elements)

### Text

Display-optimized typography. Enforces minimum font weight. Applies `box-trim-both box-edge-cap` by default to eliminate internal leading for pixel-perfect vertical alignment. Override with `box-trim-none` via `className` if needed.

```tsx
<Text size="lg" weight="bold">Title</Text>
<Text size="sm" className="text-mrbd-text-muted">Subtitle</Text>
```

Props: `children`, `size?: 'sm' | 'md' | 'lg'`, `weight?: 'medium' | 'semibold' | 'bold'`, `as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'label'`, `dir?: 'ltr' | 'rtl' | 'auto'` (default `'auto'`), `className?`

### Focusable

Makes children spatially navigable. Every `id` must be unique. On Enter key press, fires `onSelect` and clicks the first child element.

```tsx
<Focusable id="item-1" onSelect={handleSelect} group="list">
  <div>content</div>
</Focusable>
```

Props: `id: string` (required), `children`, `group?: string`, `autoFocus?: boolean` (default `true` — set to `false` to skip initial auto-focus while keeping the element navigable), `onSelect?: () => void`, `onFocus?: () => void`, `onBlur?: () => void`, `disabled?: boolean`, `className?`


### Button

Spatially navigable button with variants. Default variant is `secondary`. Wraps `<Focusable>` internally. Applies `box-trim-both box-edge-cap` for precise text centering within the fixed button heights.

```tsx
import { Check, X } from "lucide-react";

<Button id="ok" variant="primary" icon={Check} onClick={handleOk}>
  OK
</Button>
<Button id="cancel" variant="ghost" icon={X} onClick={handleCancel}>
  Cancel
</Button>
```

The `asChild` prop merges button styles onto a child element (e.g. `<Link>`):

```tsx
<Button id="home" asChild>
  <Link href="/home">Home</Link>
</Button>
```

Props: `id: string` (required), `children`, `variant?: 'primary' | 'secondary' | 'ghost' | 'glow' | 'danger'` (default `'secondary'`; `glow` draws a border glow stroke that brightens when targeted), `size?: 'sm' | 'md' | 'lg'`, `icon?: ComponentType`, `autoFocus?: boolean` (default `true`), `onClick?: () => void`, `onFocus?: () => void`, `onBlur?: () => void`, `onSelect?: () => void`, `disabled?: boolean`, `asChild?: boolean`, `className?`

### Card

Content container with rounded corners and subtle tint-derived background. Good for grouping related content like notifications, status panels, or action prompts.

```tsx
<Card>Basic card content</Card>
<Card className="mt-auto">Pushed to bottom</Card>
<Card className="flex flex-col gap-1">
  <div className="flex flex-row justify-between">
    <Text size="sm" className="text-mrbd-text-muted">Status</Text>
    <Text size="sm" weight="semibold">Active</Text>
  </div>
</Card>
```

Props: `children`, `className?`

### Pill

Rounded pill/badge with a subtle gradient tint border. Applies `box-trim-both box-edge-cap` by default for consistent alignment with other trimmed text elements.

```tsx
<Pill>Status: Active</Pill>
<Pill className="px-6">Custom</Pill>
```

Props: `children`, `className?`

### LoadingSpinner

CSS-only spinner animation. Defaults to `size-8` and `text-mrbd-text`. Customize size and color via `className`.

```tsx
<LoadingSpinner />
<LoadingSpinner className="size-6 text-mrbd-accent" />
```

Props: `label?: string` (default `'Loading'`), `className?`

### ScrollContainer

The easiest way to add a scrollable region. Owns the required layout wrapper (`flex min-h-0 flex-1 flex-row`), renders `<ScrollArea>` with fade gradients, and includes a `<ScrollBar>` indicator — all wired up internally. No `useScroll()` needed.

Place it inside any `flex h-full flex-col` parent and it will expand to fill remaining space:

```tsx
<div className="flex h-full flex-col gap-4 p-4">
  <Text size="lg" weight="bold">Title</Text>

  <ScrollContainer>
    {items.map((item) => (
      <Button key={item.id} id={item.id}>{item.label}</Button>
    ))}
  </ScrollContainer>
</div>
```

Props: `children`, `className?`

### ScrollArea

> **Advanced / escape-hatch.** Use `<ScrollContainer>` unless you need to share scroll state with elements outside the scroll region.

A scroll viewport with top/bottom fade gradients that indicate hidden content. Pair with `useScroll()` and optionally `<ScrollBar>`.

```tsx
const scroll = useScroll();

<ScrollArea
  scrollRef={scroll.scrollRef}
  canScrollUp={scroll.canScrollUp}
  canScrollDown={scroll.canScrollDown}
>
  {/* Scrollable content */}
</ScrollArea>
```

Props: `children`, `scrollRef: React.RefObject<HTMLDivElement | null>`, `canScrollUp: boolean`, `canScrollDown: boolean`, `className?`

### ScrollBar

> **Advanced / escape-hatch.** Included automatically by `<ScrollContainer>`.

A composable scrollbar indicator. The track is fixed height; the thumb scales proportionally. Fades in/out based on `isScrolling` from `useScroll()`.

```tsx
const scroll = useScroll();

<div className="flex min-h-0 flex-1 flex-row gap-2">
  <ScrollArea scrollRef={scroll.scrollRef} canScrollUp={scroll.canScrollUp} canScrollDown={scroll.canScrollDown}>
    {items}
  </ScrollArea>
  <ScrollBar
    scrollHeight={scroll.scrollHeight}
    clientHeight={scroll.clientHeight}
    scrollTop={scroll.scrollTop}
    isScrolling={scroll.isScrolling}
  />
</div>
```

Props: `scrollHeight: number`, `clientHeight: number`, `scrollTop: number`, `isScrolling?: boolean`, `className?`

## Navigation and Back

The Back gesture (middle-finger tap on the Neural Band, two-finger tap on the touchpad) never reaches the page as a key. The shell calls `history.back()` when browser history has an entry, and opens the system menu when it does not. So:

- Keep navigation in browser history. Next.js routing does this. For in-page screens, `history.pushState` when they open and render from `popstate`.
- The shell allows five history entries in total, including the first page. Spend them on screens, not on focus changes or tooltips.
- Do not add an on-screen Back button.
- On desktop, `Escape`, `Backspace`, `BrowserBack`, and `GoBack` stand in for the gesture. `<DisplayRoot>` handles them and calls `history.back()` by default.
- To undo in-page state (close a menu, clear a selection), use `useBackNavigation()` and return `false` when there is nothing to undo. It runs for the desktop aliases only. State that must also survive the device gesture needs a history entry.

```tsx
useBackNavigation(() => {
  if (!menuOpen) {
    return false;
  }
  setMenuOpen(false);
});
```

## Hooks

### useSpatialInput()

```tsx
const { activeKey, lastKey } = useSpatialInput({
  onPress: (key) => {},   // 'up' | 'down' | 'left' | 'right' | 'select' | 'back'
  onRelease: (key) => {},
  disabled: false,
});
```

### useBackNavigation()

Handle a desktop Back key before `<DisplayRoot>` does. Return `false` to decline so `<DisplayRoot>` calls `history.back()`. See Navigation and Back.

```tsx
useBackNavigation(() => {
  if (selectedItem === null) {
    return false;
  }
  setSelectedItem(null);
});
```

### useFocusManager()

Must be inside `<DisplayRoot>`.

```tsx
const { focusedId, move, focus } = useFocusManager();
move("down");        // Move focus spatially
focus("my-button");  // Focus by ID
```

### usePreferredFocus()

Declare the preferred initial focus target for the current page.

Takes priority over sessionStorage restore and first-element auto-focus. Cleans up on unmount so the next page gets normal auto-focus behavior.

```tsx
// Focus the currently selected item
usePreferredFocus(selectedItemId);

// Or pass null to use default auto-focus behavior
usePreferredFocus(null);
```

Focus priority model:

| Priority | Source |
|---|---|
| 1st | `usePreferredFocus(id)` |
| 2nd | Explicit `focus()` via `useFocusManager` |
| 3rd | SessionStorage restore (back-nav) |
| 4th | First auto-focusable element |

### useIsMrbd()

Client-side device detection (checks for "Greatwhite" in user agent). Returns `false` during SSR.

```tsx
const isMrbd = useIsMrbd(); // boolean
```

### useScroll()

Tracks scroll position of a container. Returns scroll metrics and a ref to attach to the scrollable element. Designed to pair with `<ScrollArea>` and `<ScrollBar>`.

```tsx
const scroll = useScroll();
// scroll.scrollRef      — attach to scrollable container
// scroll.scrollTop      — current scroll position
// scroll.scrollHeight   — total scrollable height
// scroll.clientHeight   — visible viewport height
// scroll.canScrollUp    — true when scrolled past top
// scroll.canScrollDown  — true when more content below
// scroll.isScrolling    — true while scroll position is actively changing
```

## Server Detection

```typescript
// Any server runtime
import { isMrbd, isMrbdFromHeaders } from "mrbd-ui-kit/server";
isMrbd(userAgentString);           // boolean
isMrbdFromHeaders(request.headers); // boolean

// Next.js RSC / Server Actions
import { isMrbdServer } from "mrbd-ui-kit/next";
const isMrbd = await isMrbdServer(); // boolean
```

## Theming

The entire color palette is driven by a single CSS variable: `--color-mrbd-accent`. By default it's white (`#ffffff`). Override it to theme your entire app with one line:

```css
/* global.css — after the mrbd-ui-kit imports */
:root {
  --color-mrbd-accent: #14b8a6; /* teal */
}
```

All surface, border, and glow tokens are derived from this variable via `color-mix()`. Changing `--color-mrbd-accent` automatically updates everything. The palette below gives you display-safe values to point it at, e.g. `--color-mrbd-accent: var(--color-mrbd-palette-teal)`.

## Tailwind Tokens Available After Import

### Colors
- Accent: `mrbd-accent`, `mrbd-on-accent` (text on accent fills)
- Surfaces: `mrbd-background` (black, transparent on device), `mrbd-surface-1` (accent 10%), `mrbd-surface-2` (20%), `mrbd-surface-3` (30%)
- Borders: `mrbd-border` (10%), `mrbd-border-targeted` (40%, focused or hovered)
- Text: `mrbd-text` (92% white), `mrbd-text-muted` (60% white)
- Status: `mrbd-danger`
- Palette: `mrbd-palette-blue`, `-cyan`, `-teal`, `-green`, `-yellow`, `-orange`, `-red`, `-rose`, `-pink`, `-purple`, `-violet`, `-indigo`, `-gray`

### Glows
- `shadow-mrbd-glow`: inner glow that fills the targeted element
- `shadow-mrbd-glow-ring`: outer ring, moved between focused elements by `<DisplayRoot>`
- `mrbd-glow-stroke`: 1px glow on the border; set `--mrbd-glow-stroke-width` and `--mrbd-glow-stroke-opacity` on the targeted state

Use as: `bg-mrbd-surface-2`, `border-mrbd-border`, `text-mrbd-text-muted`, `shadow-mrbd-glow`

## Full App Example

```tsx
"use client";

import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import {
  Button,
  Card,
  DisplayRoot,
  LoadingSpinner,
  Text,
} from "mrbd-ui-kit";

export default function MyMRBDApp() {
  const [loading, setLoading] = useState(false);

  return (
    <DisplayRoot>
      <div className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex flex-row gap-2 items-center">
          <Search className="size-5 text-mrbd-accent" />
          <Text size="lg" weight="bold">
            Notifications
          </Text>
        </div>

        {/* Content card */}
        <Card>
          <div className="flex flex-col gap-2">
            <Text weight="semibold">New message from Alex</Text>
            <Text size="sm" className="text-mrbd-text-muted">
              Hey, are you free for lunch?
            </Text>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-row gap-3">
          <Button
            id="action-btn"
            variant="primary"
            icon={Check}
            onClick={() => setLoading(true)}
          >
            Accept
          </Button>
          <Button id="decline-btn" icon={X} onClick={() => {}}>
            Decline
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center">
            <LoadingSpinner className="size-6" />
          </div>
        )}
      </div>
    </DisplayRoot>
  );
}
```

## Testing Your App

1. Desktop browser: Open your app at `localhost:3000`. Use arrow keys to navigate and enter to select.
2. On device: Deploy to HTTPS URL → Meta AI app → Devices → Display Glasses → App connections → Web apps → Add URL.
3. Device detection: Override user agent in Chrome DevTools to include "Greatwhite" to test `useIsMrbd()`.
