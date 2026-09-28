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

## Examples

[`examples/`](./examples) is a small Vite app that exercises `QueryView` interactively; it's deployed to GitHub Pages (see below). It's a separate npm package that depends on this one via `file:..`, so it always builds against your local changes:

```bash
npm install
npm run build      # build the library first — examples import dist/
cd examples
npm install
npm run dev         # http://localhost:5173
```

If you change the public API, add or update the relevant example so the live demo stays accurate.

## Pull requests

1. Create a branch from `main`.
2. Add or update tests for any behaviour change.
3. Make sure `npm run lint`, `npm run typecheck` and `npm test` pass (CI runs the same checks, plus a build of `examples/`).
4. Add a line to the `Unreleased` section of [CHANGELOG.md](./CHANGELOG.md).
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, for example `fix: ...` or `feat: ...`.

## Releasing (maintainers)

Publishing to npm is automated by [`.github/workflows/release.yml`](./.github/workflows/release.yml): pushing a `v*` tag builds the package and runs `npm publish` with [provenance](https://docs.npmjs.com/generating-provenance-statements) from GitHub Actions' OIDC token, then creates a matching GitHub release. In practice, a release is just:

1. Move the `Unreleased` changelog entries under a new version heading in [CHANGELOG.md](./CHANGELOG.md).
2. `npm version <patch|minor|major>` — bumps `package.json` and creates a `vX.Y.Z` git tag.
3. `git push --follow-tags` — pushes the commit and the tag. The tag push triggers the Release workflow, which publishes to npm and creates the GitHub release.
4. Watch the [Release workflow run](https://github.com/Bar-2020/react-query-view/actions/workflows/release.yml) and confirm the new version shows up on [npmjs.com/package/react-query-view](https://www.npmjs.com/package/react-query-view).

### One-time npm publishing setup

Only needed once per repository, already done for `react-query-view` but documented here in case the package is ever forked or the token needs rotating:

1. Create an npm **Automation** access token (npmjs.com → your avatar → *Access Tokens* → *Generate New Token* → *Automation*). Automation tokens work in CI without requiring interactive 2FA approval for each publish.
2. Add it as a repository secret named `NPM_TOKEN` (GitHub repo → *Settings* → *Secrets and variables* → *Actions* → *New repository secret*).
3. `publishConfig.provenance` is already set to `true` in `package.json`, and `release.yml` grants the workflow `id-token: write`, which is what npm needs to attach a provenance attestation. No extra npm-side configuration is required for a public package.
4. First publish of a new package name must be done manually once (`npm publish` from a maintainer's machine, logged in with `npm login`) if the name isn't already registered — after that, the automated workflow can publish subsequent versions.

### Publishing manually (fallback)

Only use this if the Release workflow is broken and a release can't wait. `prepublishOnly` already runs lint, typecheck, tests and the build before publishing:

```bash
npm login           # if not already authenticated
npm publish
```

Prefer fixing the workflow and tagging normally whenever possible, so releases stay reproducible and provenance-signed.

## Deploying the examples site

[`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) builds [`examples/`](./examples) and deploys it to GitHub Pages on every push to `main` that touches `src/`, `examples/`, or the workflow itself (also runnable manually from the Actions tab).

One-time repository setup (already done for `react-query-view`): under *Settings → Pages → Build and deployment*, set **Source** to **GitHub Actions**. No `gh-pages` branch or extra secrets are needed — the workflow uses GitHub's official `actions/deploy-pages` action with the repository's built-in `GITHUB_TOKEN`.

The site is served at `https://bar-2020.github.io/react-query-view/`; `examples/vite.config.ts` sets the matching Vite `base` path for both the production build and `npm run preview`.
