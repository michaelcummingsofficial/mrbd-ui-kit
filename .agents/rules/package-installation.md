When installing dependencies, you must strictly adhere to the dependency types. We use pnpm as the package manager.

- Runtime Dependencies: If the package is required for the application to run, install it as a standard dependency.
- Development Dependencies: If the package is only used during development or build time, you must use the `-D` flag.

pnpm blocks package lifecycle scripts by default. If a package needs its postinstall build step (like Prisma's engines or sharp), add it to `allowBuilds` and `onlyBuiltDependencies` in `pnpm-workspace.yaml`.
