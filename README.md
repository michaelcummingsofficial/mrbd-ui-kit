# mrbd-ui-kit

[![npm version](https://img.shields.io/npm/v/mrbd-ui-kit.svg)](https://www.npmjs.com/package/mrbd-ui-kit)
[![GitHub](https://img.shields.io/github/license/michaelcummingsofficial/mrbd-ui-kit)](https://github.com/michaelcummingsofficial/mrbd-ui-kit/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/michaelcummingsofficial/mrbd-ui-kit?style=social)](https://github.com/michaelcummingsofficial/mrbd-ui-kit)

React component library for Meta Ray-Ban Display web apps. Opinionated defaults, fully customizable.

See it in action: [**Live demo**](https://www.mrbd.fun/)


## Install

```bash
npm install mrbd-ui-kit
```

## Setup

Add the theme and base styles to your app's global CSS:

```css
/* global.css */
@import "tailwindcss";
@import "mrbd-ui-kit/css";
```

This single import provides Tailwind v4 theme tokens (colors, shadows), focus ring styles, scrollbar hiding, transition defaults, and [`tailwindcss-text-box-trim`](https://www.npmjs.com/package/tailwindcss-text-box-trim) utilities for pixel-perfect typographic spacing.

### Font Configuration

The UI kit ships with no default font bundled to keep your application lightweight. We highly recommend using a clear, bold sans-serif font family. 

- **For Latin & Cyrillic scripts:** We recommend **Nunito** (weights 500, 600, and 700), as we've found it looks exceptionally clear and is highly legible on the Meta Ray-Ban Display.
- **For CJK, Thai, Arabic, and other scripts:** Nunito does not support these writing systems. For full Unicode coverage, we recommend configuring a fallback bold sans-serif font such as **Noto Sans** (e.g. Noto Sans CJK, Noto Sans Thai).

Setting the correct HTML `lang` attribute (e.g. `lang="ja"`, `lang="th"`) is also highly recommended to ensure the browser selects appropriate localized font glyphs.

You can configure fonts in a Next.js application using `next/font/google`:

```tsx
// app/layout.tsx
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-nunito"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
```

You can configure fonts in a standard React application by importing Google Fonts directly in your CSS file and overriding the default sans font:

```css
/* global.css */
@import "tailwindcss";
@import "mrbd-ui-kit/css";
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700&display=swap');

@theme {
  --font-sans: "Nunito", "Noto Sans", sans-serif;
}
```

## Quick Start

```tsx
import { Check } from "lucide-react";
import { Button, DisplayRoot, Text } from "mrbd-ui-kit";

export default function App() {
  return (
    <DisplayRoot>
      <div className="flex flex-col gap-4 p-6">
        <Text size="lg" weight="bold">Hello, Display</Text>
        <Text className="text-gray-400">Glanceable UI for your glasses.</Text>

        <Button id="action-btn" variant="primary" icon={Check} onClick={() => console.log("pressed!")}>
          Get Started
        </Button>
      </div>
    </DisplayRoot>
  );
}
```

## Display Constraints

The Meta Ray-Ban Display is fundamentally different from phones and monitors. These constraints are baked into every component:

| Constraint | Value | What mrbd-ui-kit does |
|---|---|---|
| Resolution | 600 × 600 px | `<DisplayRoot>` sets the viewport |
| Display type | Additive (LCoS) | Black = transparent. No pure `#FFF` in the palette — prevents ghosting |
| Input | Spatial (Neural Band / temple touch) | Spatial focus engine handles arrow-key navigation automatically |
| Typography | Bold sans-serif | `<Text>` enforces minimum `font-weight: 500` and applies `text-box-trim` for pixel-perfect alignment |
| Shadows | Never drop-shadow | All shadows are outer glows (drop shadows look like dirt on the lens) |
| Layout | Monocular, right eye | F-pattern, right-anchored layouts recommended |

## Components

### Primitives

#### `<DisplayRoot>`

Required root wrapper. Sets up the 600×600 viewport, focus engine context, and keyboard event handling.

```tsx
<DisplayRoot
  focusOptions={{ wrap: true }}
  onSelect={(focusedId) => console.log("selected:", focusedId)}
>
  {children}
</DisplayRoot>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `focusOptions` | `FocusEngineOptions` | `{ wrap: true }` | Configure focus wrapping |
| `onSelect` | `(id: string) => void` | — | Called on Enter/select while an element is focused |
| `className` | `string` | — | Additional classes for the root div |

#### `<Text>`

Display-optimized typography with enforced minimum font weight. Applies `box-trim-both box-edge-cap` by default to eliminate internal leading — critical for the 600×600 display where every pixel counts. Override with `box-trim-none` via `className` if needed.

```tsx
<Text size="lg" weight="bold">Important Message</Text>
<Text size="sm" className="text-gray-400">Secondary info</Text>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Font size |
| `weight` | `'medium' \| 'semibold' \| 'bold'` | `'medium'` | Font weight (min 500) |
| `as` | `'p' \| 'span' \| 'h1' \| 'h2' \| 'h3' \| 'label'` | `'span'` | HTML element |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` | Text direction |
| `className` | `string` | — | Additional classes |

#### `<Focusable>`

Makes any child spatially navigable. Registers with the spatial focus engine. On Enter key, fires `onSelect` and clicks the first child element.

```tsx
<Focusable id="my-item" onSelect={() => handleSelect()} onFocus={() => handleFocus()}>
  <div>Custom focusable content</div>
</Focusable>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | **required** | Unique ID for focus registration |
| `group` | `string` | — | Scope focus navigation to this group |
| `autoFocus` | `boolean` | `true` | When `false`, skip for initial auto-focus (still navigable via arrows, `focus()`, and session restore) |
| `onSelect` | `() => void` | — | Called on Enter key |
| `onFocus` | `() => void` | — | Called when focused |
| `onBlur` | `() => void` | — | Called when focus leaves |
| `disabled` | `boolean` | `false` | Remove from focus order |
| `className` | `string` | — | Additional classes |

### Composites

#### `<Button>`

Spatially navigable button with variants. Default variant is `secondary`. Wraps `<Focusable>` internally. Applies `box-trim-both box-edge-cap` for precise text centering within fixed button heights.

```tsx
import { Check, X } from "lucide-react";

<Button id="confirm" variant="primary" icon={Check} onClick={handleConfirm}>
  Confirm
</Button>
<Button id="cancel" icon={X} onClick={handleCancel}>
  Cancel
</Button>
```

The `asChild` prop merges button styles onto a child element instead of rendering a `<button>`:

```tsx
<Button id="home-link" asChild>
  <Link href="/home">Home</Link>
</Button>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'ghost'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `id` | `string` | **required** | Focus engine ID |
| `icon` | `ComponentType` | — | Icon component before label |
| `autoFocus` | `boolean` | `true` | When `false`, skip for initial auto-focus (still navigable) |
| `onClick` | `() => void` | — | Called on select (Enter key) |
| `onFocus` | `() => void` | — | Called when focused |
| `onBlur` | `() => void` | — | Called when focus leaves |
| `onSelect` | `() => void` | — | Alias for `onClick` |
| `disabled` | `boolean` | `false` | Disabled state |
| `asChild` | `boolean` | `false` | Merge styles onto child element instead of `<button>` |
| `className` | `string` | — | Additional classes |

#### `<Card>`

Content container with rounded corners and subtle tint-derived background. Good for grouping related content like notifications, status panels, or action prompts.

```tsx
<Card>Basic card content</Card>
<Card className="mt-auto">Pushed to bottom</Card>
<Card className="flex flex-col gap-1">
  <div className="flex flex-row justify-between">
    <Text size="sm" className="text-gray-400">Status</Text>
    <Text size="sm" weight="semibold">Active</Text>
  </div>
</Card>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional classes |

#### `<Pill>`

Rounded pill/badge with a subtle gradient tint border. Applies `box-trim-both box-edge-cap` by default for consistent alignment with other trimmed text elements.

```tsx
<Pill>Status: Active</Pill>
<Pill className="px-6">Custom styling</Pill>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional classes |

#### `<LoadingSpinner>`

CSS-only spinner animation. Defaults to `size-8` and `text-mrbd-accent`. Customize size and color via `className`.

```tsx
<LoadingSpinner />
<LoadingSpinner label="Saving data..." className="size-6 text-blue-500" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `'Loading'` | Accessible label (screen reader announcement) |
| `className` | `string` | — | Additional classes (size, color, etc.) |

#### `<ScrollContainer>`

The easiest way to add a scrollable region. Handles the layout, fade, and scrollbar automatically.

Place it inside any `flex h-full flex-col` parent and it expands to fill the remaining space:

```tsx
import { ScrollContainer } from "mrbd-ui-kit";

<div className="flex h-full flex-col gap-4 p-4">
  <Text size="lg" weight="bold">Title</Text>

  <ScrollContainer>
    {items.map((item) => (
      <Button key={item.id} id={item.id}>{item.label}</Button>
    ))}
  </ScrollContainer>
</div>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | **required** | Scrollable content |
| `className` | `string` | — | Additional classes on the outer wrapper |

#### `<ScrollArea>` _(advanced)_

> Use `<ScrollContainer>` for the common case. Reach for `<ScrollArea>` directly only when you need to share a `useScroll()` instance with other elements outside the scroll region.

A scroll viewport with fade gradients that indicate hidden content above or below. Pair with `useScroll()` and optionally `<ScrollBar>`.

**Required layout:** `<ScrollArea>` must live inside a `flex min-h-0 flex-1 flex-row` parent, otherwise it has no bounded height and will not scroll.

```tsx
const scroll = useScroll();

<div className="flex min-h-0 flex-1 flex-row gap-2">
  <ScrollArea
    scrollRef={scroll.scrollRef}
    canScrollUp={scroll.canScrollUp}
    canScrollDown={scroll.canScrollDown}
  >
    {/* Scrollable content */}
  </ScrollArea>
  <ScrollBar
    scrollHeight={scroll.scrollHeight}
    clientHeight={scroll.clientHeight}
    scrollTop={scroll.scrollTop}
    isScrolling={scroll.isScrolling}
  />
</div>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `scrollRef` | `React.RefObject<HTMLDivElement \| null>` | **required** | Ref from `useScroll()` |
| `canScrollUp` | `boolean` | **required** | Show top fade gradient |
| `canScrollDown` | `boolean` | **required** | Show bottom fade gradient |
| `className` | `string` | — | Additional classes |

#### `<ScrollBar>` _(advanced)_

> Included automatically by `<ScrollContainer>`. Use directly only alongside a manual `<ScrollArea>` setup.

A composable scrollbar indicator. The track is fixed height (112px). The thumb scales proportionally to content. Fades in only while scrolling.

```tsx
const scroll = useScroll();

<div className="flex flex-row gap-2">
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

| Prop | Type | Default | Description |
|---|---|---|---|
| `scrollHeight` | `number` | **required** | Total scrollable height |
| `clientHeight` | `number` | **required** | Visible viewport height |
| `scrollTop` | `number` | **required** | Current scroll position |
| `isScrolling` | `boolean` | `false` | Show/hide the scrollbar |
| `className` | `string` | — | Additional classes |

## Hooks

### `useSpatialInput()`

Subscribe to spatial input events (arrow keys + Enter from Neural Band or temple touch).

```tsx
const { activeKey, lastKey } = useSpatialInput({
  onPress: (key) => console.log("pressed:", key),
  onRelease: (key) => console.log("released:", key),
});
```

### `useFocusManager()`

Programmatic focus control. Must be used inside `<DisplayRoot>`.

```tsx
const { focusedId, move, focus } = useFocusManager();

// Move focus programmatically
move("down");

// Focus a specific element
focus("my-button");
```

### `usePreferredFocus()`

Declare the preferred initial focus target for the current page. 

Takes priority over sessionStorage restore and first-element auto-focus. Cleans up on unmount so the next page gets normal auto-focus behavior.

```tsx
import { usePreferredFocus } from "mrbd-ui-kit";

// Focus the currently active item when the page mounts
function LanguagePicker({ selectedLocale }: { selectedLocale: string }) {
  usePreferredFocus(`lang-${selectedLocale}`);

  return (
    <ScrollContainer>
      {locales.map((l) => (
        <Button key={l} id={`lang-${l}`}>{l}</Button>
      ))}
    </ScrollContainer>
  );
}

// Pass null to use default auto-focus behavior
usePreferredFocus(null);
```

**Focus priority model:**

| Priority | Source |
|---|---|
| 1st | `usePreferredFocus(id)` |
| 2nd | Explicit `focus()` via `useFocusManager` |
| 3rd | SessionStorage restore (back-nav) |
| 4th | First auto-focusable element |

All four methods can focus any element, including `autoFocus={false}` elements. The `autoFocus` flag only controls two things:

- **Auto-focus selection** — `autoFocus={false}` elements are skipped when choosing the initial focus target (priority 4)
- **SessionStorage persistence** — focusing an `autoFocus={false}` element never overwrites the saved focus ID, so back-navigation restores the last *content* item instead of toolbar chrome

### `useIsMrbd()`

Client-side detection of Meta Ray-Ban Display via user agent. Returns `false` during SSR.

```tsx
const isMrbd = useIsMrbd();

if (isMrbd) {
  return <MRBDApp />;
}
return <StandardWebApp />;
```

### `useScroll()`

Tracks scroll position of a container element. Returns scroll metrics and a ref to attach. Designed to pair with `<ScrollArea>` and `<ScrollBar>`.

```tsx
const scroll = useScroll();

// scroll.scrollRef      — attach to scrollable container
// scroll.scrollTop      — current position (px)
// scroll.scrollHeight   — total content height (px)
// scroll.clientHeight   — visible viewport height (px)
// scroll.canScrollUp    — true when content is hidden above
// scroll.canScrollDown  — true when content is hidden below
// scroll.isScrolling    — true while scroll position is actively changing
```

## Server-Side Detection

### Generic server (any runtime)

```tsx
import { isMrbd, isMrbdFromHeaders } from "mrbd-ui-kit/server";

// Check a raw user agent string
isMrbd(userAgentString); // boolean

// Check from a Headers object
isMrbdFromHeaders(request.headers); // boolean
```

### Next.js (React Server Components)

```tsx
import { isMrbdServer } from "mrbd-ui-kit/next";

export default async function Page() {
  const isMrbd = await isMrbdServer();

  if (isMrbd) {
    return <MRBDLayout />;
  }
  return <StandardLayout />;
}
```

## Theming

The entire color palette is driven by a single CSS variable: **`--color-mrbd-accent`**. By default it's white (`#ffffff`). Override it to theme your entire app with one line:

```css
/* global.css — after the mrbd-ui-kit imports */
:root {
  --color-mrbd-accent: var(--color-teal-400); 
}
```

All surface colors, glows, and border tints are derived from this variable via opacity modifiers. Changing `--color-mrbd-accent` automatically updates:
- `bg-mrbd-accent/90` (primary button)
- `bg-mrbd-accent/10` (secondary button)
- `shadow-mrbd-glow` value
- Border tints on `Button`, `Pill`, etc.

## Tailwind Theme Tokens

When you import `mrbd-ui-kit/css/theme`, these Tailwind utilities become available:

### Colors
- `bg-mrbd-accent` — The tint color (default white); use with opacity modifiers like `bg-mrbd-accent/10`
- `text-mrbd-text` — Primary text (white at 92% — not pure white)

### Shadows (Outer Glow)
- `shadow-mrbd-glow` — Inner glow (used by Button hover/focus)


## Localization (i18n)

The `mrbd-ui-kit` library is architected from the ground up to be translation-agnostic and easy to localize:

1. **No Hardcoded Strings:** There are no translation dictionaries or hardcoded user-facing strings that cannot be customized. Developer-facing exceptions (such as `<Slot>` or context errors) are in English but are never shown to end-users.
2. **Translation via Props:** All text, subtitles, accessibility labels, and content flow purely through standard component props or children.
3. **Accessibility & Localization:** Visual-only interactive components (such as `<LoadingSpinner>`) allow passing an explicit, localized `label` prop to ensure screen readers announce them properly in any target language (defaulting to `'Loading'`).

### Right-to-Left (RTL) Support

RTL locales (such as Arabic and Hebrew) are supported out of the box:
- Use the `dir` prop on the `<Text>` component (`'ltr' | 'rtl' | 'auto'`) to specify or automatically detect text direction (defaults to `'auto'`).
- Set `dir="rtl"` on your outer layout container or on the `<html>` tag to align layouts accordingly.
- Because Meta Ray-Ban Display layouts are right-aligned/F-pattern for the monocular display, RTL flows integrate naturally on the hardware.

## Design Guidelines

1. **Never use pure white (`#FFFFFF`)** — It causes ghosting on additive displays. Use `text-mrbd-text` (92% opacity white) instead.
2. **Never use drop shadows** — They look like dirt on the lens. Use outer glows (`shadow-mrbd-glow`).
3. **Keep it glanceable** — Users scan in under 2 seconds. Prioritize hierarchy and brevity.
4. **Right-anchor important content** — The display is monocular (right eye). Use F-pattern layouts.
5. **Use bold fonts** — Minimum `font-weight: 500`. Thin fonts are illegible on the display.
6. **Minimize re-renders** — Battery-constrained device. Keep components lightweight.

## License

See the [LICENSE](LICENSE) for details.
