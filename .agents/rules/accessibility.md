Every UI change must meet WCAG 2.1 AA standards. Accessibility is not a follow-up task — it ships with the feature.

## Semantic HTML

- Use `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, and `<article>` instead of generic `<div>` wrappers.
- Every page must have exactly one `<main id="main-content">` landmark.
- Use heading hierarchy (`h1` → `h2` → `h3`) without skipping levels. One `<h1>` per page.
- The `<html>` element must have a `lang` attribute matching the page language.

## Interactive Elements

- **Icon-only buttons** must always have an `aria-label`.
- **Links that look like buttons** are `<Button id="…" asChild><Link href="…">…</Link></Button>` in the display UI. The link stays a native `<a>` and still joins the focus engine. On the desktop site, style the `<a>` directly. Never build a link from a non-`<a>` element.
- All interactive elements must be **keyboard-accessible**: focusable with Tab, activatable with Enter/Space. Inside `<DisplayRoot>` that means wrapping them in `<Focusable>` or a composite such as `<Button>`, so the arrow keys and Enter that the glasses send can reach them.
- Decorative icons and images must have `aria-hidden="true"`.
- Never rely solely on color, hover, or pointer events to convey meaning or enable interaction.

## Forms & Inputs

- Every `<input>`, `<select>`, and `<textarea>` must have an associated `<label>` (via `htmlFor`/`id`) or an `aria-label`.
- Use `aria-describedby` for supplemental help text or error messages tied to a specific field.
- Group related radio buttons and checkboxes with `<fieldset>` and `<legend>`.

## Feedback & Live Regions

- Error messages must use `role="alert"` so screen readers announce them immediately.
- Success/status messages must use `role="status"`.
- After CRUD operations, manage focus intentionally — return it to the relevant input or the next logical element.

## Navigation

- Include a skip-to-content link (`<a href="#main-content">`) as the first focusable element in the layout.
- Wrap navigation link groups in `<nav>` with a descriptive `aria-label` (e.g., `"Footer"`, `"Main navigation"`).
- The site logo link must have `aria-label` identifying it as the home link.

## Drag & Drop

- Drag handles must have `aria-label` describing which item they reorder (e.g., `"Reorder {name}"`).
- Provide keyboard alternatives for all drag-and-drop interactions.

## Checklist Before Shipping

When creating or modifying UI, verify:

1. Tab through the entire flow — every interactive element is reachable and operable.
2. Icon-only buttons announce their purpose via screen reader.
3. Error and success states are announced without requiring visual confirmation.
4. No `<div>` or `<span>` is used as a clickable element without `role`, `tabIndex`, and keyboard handlers.
5. All inputs have visible or programmatic labels.
