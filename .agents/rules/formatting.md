Braces always, and the body goes on its own line. This includes guard clauses, the case most often written inline:

```typescript
const post = await getPostBySlug(slug);
if (!post) {
	notFound();
}

const related = await getRelatedPosts(slug);
return render(post, related);
```

Never `if (!post) return;`. The same applies to `throw`, `continue`, `break`, and single-statement loops.

Inside a function body the only blank line is the one after a block's closing brace, separating the guard from the work it protects. Nothing else gets one: not before the guard, not before the final `return`. Statements run flush.

The import block is one block. A `"use client"` or `"use server"` directive sits flush against the first import, and imports run flush against each other, with a single blank line after the last one. Copied-in code that groups its imports with blank lines gets collapsed.

Everything else at the top level is untouched, so exports, interfaces, types, and declarations keep whatever spacing reads best.

`curly` and `padding-line-between-statements` in `eslint.config.ts` enforce it, and `pnpm format` rewrites offenders.
