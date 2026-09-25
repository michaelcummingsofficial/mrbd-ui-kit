Whenever you make a change that touches the public surface of `mrbd-ui-kit`, you **must** update both `AGENTS.md` and `README.md` in the same session. Leaving them out of sync with the implementation is a bug.

## What counts as a public-surface change

| Change type | Examples |
|---|---|
| New component | Adding `<Pill>`, `<Modal>`, `<ProgressBar>` |
| Removed component | Deleting or deprecating a component |
| New or removed prop | Adding `onLongPress` to `<Button>`, removing a variant |
| Prop type change | Narrowing or widening a union, changing a default value |
| New or removed hook | Adding `useGesture()`, removing `useIsMRBD()` |
| New Tailwind token | New color, shadow, or sizing token in `mrbd-ui-kit/css/theme` |
| Import path change | Moving an export between `mrbd-ui-kit`, `mrbd-ui-kit/server`, `mrbd-ui-kit/next` |
| Behavioral change | Changing how D-pad focus works, changing focus group semantics |

## What to update

### In `AGENTS.md`

- **Component Reference** — keep props list, example snippet, and description accurate
- **Hooks** — keep signatures, parameters, and return values current
- **Import Map** — reflect any additions, removals, or path changes
- **DO / NEVER lists** — add or remove rules if constraints change

### In `README.md`

- **Components > Primitives / Composites** — keep prop tables and code examples accurate
- **Hooks** — keep signatures and usage examples current
- **Tailwind Theme Tokens** — reflect any new or removed tokens
- **Quick Start / Full App Example** — update if the minimal required usage changes

## Rules

- Update docs **before** considering the task done.
- If you remove a feature, **delete** its documentation entirely — do not leave stale examples.
- If you rename a prop or variant, find and update **every** code block in both files that references the old name.
