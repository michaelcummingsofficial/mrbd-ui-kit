Every session should improve the codebase, not just add to it. Actively refactor code you encounter, even outside your immediate task scope.

- DRY: Consolidate duplicate patterns into reuseable functions after the 2nd occurence.
- Clean: Delete dead code immediately (unused imports, functions, variables, commented code)
- Leverage: Use battle-tested packages over custom implementations
- Readable: Maintain comments and clear naming. Don't sacrifice clarity for fewer lines of code.

Leave the code cleaner than you found it. Fewer lines of code through better abstractions.

## CRITICAL: Always reuse

Scan the codebase to check for existing implementations you can re-use. Especially with regard to UI composition. If we have an established way of doing something (like forms), follow that pattern.
