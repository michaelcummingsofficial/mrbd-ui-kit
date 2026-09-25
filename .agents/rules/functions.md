One exported function per file, named exactly after the function: `cn` → `lib/cn.ts`, `objectKeysToArray` → `lib/zod/objectKeysToArray.ts`, `useDebounce` → `hooks/useDebounce.ts`. Applies to utilities and hooks in both packages. Components follow the `components/` conventions instead: kebab-case files named after the component, such as `components/scroll-area.tsx`.

- Private helpers may stay unexported in the same file. When a second file needs one, give it its own file.
- No barrel files, with one exception: the package entry points `src/index.ts`, `src/server/index.ts`, and `src/next/index.ts` in `packages/mrbd-ui-kit`. They exist because they are what consumers import, and `tsup.config.ts` builds from them. Internal code imports from the function's own path, never from an entry point.
- Group by domain in a folder (`lib/zod/`, `lib/posts/`), still one function per file.
