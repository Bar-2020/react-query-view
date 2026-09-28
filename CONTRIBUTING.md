# Contributing

Thanks for your interest in improving `react-query-view`! Bug reports, ideas and pull requests are all welcome.

## Getting started

```bash
git clone https://github.com/Bar-2020/react-query-view.git
cd react-query-view
nvm use        # Node 20, see .nvmrc
npm install
```

## Scripts

| Command                 | What it does                                  |
| ----------------------- | --------------------------------------------- |
| `npm test`              | Run the Vitest suite once                     |
| `npm run test:watch`    | Run tests in watch mode                       |
| `npm run test:coverage` | Run tests with coverage thresholds            |
| `npm run lint`          | ESLint                                        |
| `npm run format`        | Format everything with Prettier               |
| `npm run typecheck`     | TypeScript type check                         |
| `npm run build`         | Build ESM, CJS and type declarations to dist/ |

## Pull requests

1. Create a branch from `main`.
2. Add or update tests for any behaviour change.
3. Make sure `npm run lint`, `npm run typecheck` and `npm test` pass (CI runs the same checks).
4. Add a line to the `Unreleased` section of [CHANGELOG.md](./CHANGELOG.md).
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, for example `fix: ...` or `feat: ...`.

## Releasing (maintainers)

1. Move the `Unreleased` changelog entries under a new version heading.
2. `npm version <patch|minor|major>` to bump the version and create a tag.
3. `git push --follow-tags`. The Release workflow publishes to npm and creates a GitHub release.
