Every environment variable is read once, in `packages/example/lib/config.ts`, and exported as a named constant. Never touch `process.env` elsewhere. Import from `@/lib/config`. The published package in `packages/mrbd-ui-kit` reads no environment variables at all.

- Required vars use a non-null assertion (`process.env.DATABASE_URL!`); optional ones get an explicit fallback.
- Group constants under the existing section headers (Environment flags, Domain names, URLs, OpenReplay).
- Derived values (URLs, flags) belong here too, so the derivation exists once.
- Read statically: `process.env.MY_VAR`, never `process.env[name]`. Next.js inlines env vars by exact-match text replacement, so dynamic lookups are `undefined`.
- Only `NEXT_PUBLIC_` vars reach the browser. Never add that prefix to a secret to silence an error.
- No functions, no classes, no objects. Just named constants.

To add one: define the constant in `lib/config.ts`, then tell the user to set it in `.env` and Vercel. Never write `.env` files or deployment env yourself.
