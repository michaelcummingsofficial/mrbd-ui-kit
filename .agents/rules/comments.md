Default to no comment. A comment is a line the reader has to check against the code, and one that goes stale silently. Write one only when it carries something the code cannot.

## Earns a comment

- The reason is invisible: The what is clear; the why isn't. A browser quirk, a library's internals, an ordering constraint, a bug this shape prevents.
- Load-bearing and fragile: Deleting this breaks something a reader wouldn't connect to it. Say what breaks and how to check.
- The obvious approach was rejected: Someone will try to simplify it back. Say why that fails here.
- Genuinely hard context: Non-trivial math, a protocol detail, a format nobody should be expected to know.

Nothing else. If none apply, ship the code bare.

## Doesn't

- The line already says it. `aria-hidden="true"` needs no note that the element is hidden from assistive tech.
- Citing the rule you followed: WCAG numbers, lint rules, framework conventions.
- Structure labels: `// Handlers`, `// Render`, `// Constants`.
- Restating a good name. If `useEscapeToNavigate` needs "navigates on Escape", the comment is the redundant half.
- Narrating the change: `// added`, `// was previously`. Git has that.
- Anything a rename or an extraction fixes better. Try that first.

## Shape

- One or two lines. Longer means the code needs restructuring, not prose.
- A single line uses `//`. Anything longer uses a block, never stacked `//`:

```typescript
/**
 * Vercel's proxy rewrites the Host header, so the CSRF check compares
 * against X-Forwarded-Host instead.
 */
```

- Give the reason, not the mechanics.
- Put it at the surprise, not the top of the file.
- TSDoc only when the signature can't carry it: what `null` means, how two props interact, a unit, a side effect. Not `/** The user's name */`.
- The exception is the public surface of `packages/mrbd-ui-kit`: exported components, props, hooks, and their return values keep TSDoc. It is what consumers see on hover, and `README.md` and `AGENTS.md` repeat the same facts. Hold it to the same bar: defaults, units, interactions, and side effects, not a restated name.

## Editing existing code

Same bar for new ones. Delete stale comments and commented-out code. Leave invisible-reason comments alone.
