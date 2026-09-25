# Sunset mrbd-ui-kit in favor of Meta's UI Toolkit
**Workstream:** sunset | **Effort:** S | **Impact:** high

## Why

mrbd-ui-kit existed to make web apps look like native Meta Ray-Ban Display apps. On 2026-09-24 Meta published that design system itself as `@wearables-ui-toolkit/mrbd` (with `@wearables-ui-toolkit/foundation` and `@wearables-ui-toolkit/icons`), documented at https://wearables.developer.meta.com/docs/develop/webapps/design/overview/ and sourced at https://github.com/facebook/meta-ray-ban-display-ui-toolkit-web. It carries the real tokens, materials, motion, and focus behavior, and Meta's own Claude Code plugin steers every agent toward it.

A verified test on 2026-09-25 showed the official toolkit works in a Next.js 16 App Router app: `next build` passes, components server-render, and the stylesheet loads through the `App` import. Every file in the package is a client component. Nothing remains that this kit does and the official one cannot.

Keeping a lookalike alive next to the original is a losing race. The kind thing to do for users is to point them at the original and stop.

## Current state

- `packages/mrbd-ui-kit` is at 0.6.0, the final feature release. It ships back navigation, the travelling focus glow, the glow-stroke button variant, and the semantic token layer.
- `README.md` and `AGENTS.md` describe the kit with no mention of the official toolkit.
- `packages/example` at https://www.mrbd.fun is the marketing site and live demo.
- The release workflow in `.github/workflows/release.yml` publishes to npm whenever `packages/mrbd-ui-kit/package.json` changes version on `main`.

## Plan

1. **Ship 0.6.0 first.** Push `main` with the version bump so the last release reaches npm before the notice. Confirm the GitHub release and `npm view mrbd-ui-kit version` both show 0.6.0.
2. **Write the deprecation notice.** Add a callout at the top of `README.md` and `AGENTS.md`, above the badges:

   > **Deprecated.** Meta now ships the official design system for Ray-Ban Display as [`@wearables-ui-toolkit/mrbd`](https://www.npmjs.com/package/@wearables-ui-toolkit/mrbd). Use it for new apps. This package stays installable but receives no further updates. See the migration notes below.

3. **Add a migration section** to `README.md` after the notice. Keep it to a table:

   | mrbd-ui-kit | UI Toolkit for Meta Ray-Ban Display |
   |---|---|
   | `<DisplayRoot>` | `<App>` from `@wearables-ui-toolkit/mrbd` |
   | `<Button>` | `<Button title=… onClick=… />` |
   | `<Focusable>` | Native controls. The toolkit's `FocusNavigationProvider` handles focus. |
   | `<Card>` | `<Card>` from `@wearables-ui-toolkit/foundation` |
   | `<Pill>` | `<Chip>` or `<Tag>` |
   | `<LoadingSpinner>` | `<IndeterminateLoader>` or `<ProgressRing>` |
   | `<ScrollContainer>` | `<ScrollView>` |
   | `<Text>` | `<TextView>` |
   | `useBackNavigation` | `useBackNavigation` from `@wearables-ui-toolkit/foundation` |
   | `useIsMrbd`, `isMrbd`, `isMrbdServer` | No equivalent. Copy `packages/mrbd-ui-kit/src/lib/isMrbd.ts` into your app. |
   | `--color-mrbd-*` tokens | `--uit-color-*` semantic tokens |

   Add two lines under the table: the toolkit needs React 19.2.7 or later, and in Next.js you skip its React Router subpath and use the Next router.

4. **Bump to 0.6.1 with the notice only.** No code changes. The version bump makes the release workflow publish the new README to npm so the notice shows on the package page.
5. **Deprecate on npm.** Run this yourself; it needs your npm login:

   ```bash
   npm deprecate mrbd-ui-kit "Deprecated. Use Meta's official @wearables-ui-toolkit/mrbd instead: https://wearables.developer.meta.com/docs/develop/webapps/design/overview/"
   ```

6. **Update the marketing site.** In `packages/example/components/desktop-shell.tsx`, replace the hero heading and paragraph with the notice and a single CTA to the Meta docs. Keep the 600x600 demo and the README docs section so the site still serves as a reference for existing users. Delete the "Add to Glasses" link and `INSTALL_URL`.
7. **Archive the repo.** After the site deploys, set the GitHub repository to archived. Update the repo description to "Deprecated: use @wearables-ui-toolkit/mrbd". Remove the `mrbd.fun` web app registration from your glasses if you no longer want it listed.
8. **Clean up.** Delete `features/` and this file in the same commit that adds the notice, and delete the `.github/workflows/release.yml` workflow after 0.6.1 publishes so an accidental version bump cannot publish again.

## Acceptance criteria

- `npm view mrbd-ui-kit version` returns 0.6.1 and `npm install mrbd-ui-kit` prints the deprecation message.
- The npm package page, the GitHub README, and https://www.mrbd.fun all show the notice and the migration table.
- The GitHub repository is archived.
- No open workflow can publish a new version.

## Risks and open questions

- Users on 0.5.x who upgrade to 0.6.0 get the travelling glow on by default. It can be turned off with `<DisplayRoot focusGlow={false}>`. Mention this in the 0.6.0 release notes.
- `npm deprecate` is reversible with `npm deprecate mrbd-ui-kit ""`, but the message reaches every existing install immediately. Ship 0.6.0 first so nobody sees a deprecation notice before the last release exists.
- If you later want a Next.js recipe for the official toolkit, write it as a blog post or a template, not as a package.
