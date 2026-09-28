# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- `createQueryView`: passing an explicit `undefined` for a built-in slot no longer discards the factory node.

### Added

- Development warning when `resolveState` returns a key with no matching slot.
- Live, interactive examples app (`examples/`) covering every recipe in the README, deployed to GitHub Pages on every push to `main`.
- Documentation for publishing releases to npm and deploying the examples site, in [CONTRIBUTING.md](./CONTRIBUTING.md).

## [0.1.0] - 2026-09-28

### Added

- `QueryView` component with pending, error, no-data and success states.
- `createQueryView` factory for app-wide default nodes.
- `slots`, `slotProps`, `isNoData` and `resolveState` customisation points.
- Accessible default nodes: `DefaultPendingNode`, `DefaultErrorNode`, `DefaultNoDataNode`.
- `defaultIsNoData` and `resolveIsNoData` utilities.

[Unreleased]: https://github.com/Bar-2020/react-query-view/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Bar-2020/react-query-view/releases/tag/v0.1.0
