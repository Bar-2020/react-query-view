# react-query-view

**Declarative loading, error, empty and success states for [TanStack Query](https://tanstack.com/query).**

[![CI](https://github.com/Bar-2020/react-query-view/actions/workflows/ci.yml/badge.svg)](https://github.com/Bar-2020/react-query-view/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/react-query-view.svg)](https://www.npmjs.com/package/react-query-view)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-query-view)](https://bundlephobia.com/package/react-query-view)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178c6.svg)](./src/types.ts)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

`react-query-view` turns the `if (isPending) ... if (isError) ... if (!data?.length) ...` ladder you write in every data-driven component into a single, type-safe component. Sensible accessible defaults out of the box, fully replaceable when your design system needs something else.

- **Type-safe success branch.** `successElement` receives `data` narrowed to `T`, never `T | undefined`.
- **Empty states built in.** `null`, `undefined` and `[]` count as "no data" by default. Override with a boolean or a predicate.
- **Three levels of customisation.** Tweak default text with `slotProps`, replace a node with `slots`, or set app-wide defaults once with `createQueryView`.
- **Custom states.** Add your own states (rate limited, offline, stale) with `resolveState`.
- **Accessible defaults.** `role="status"` for loading and empty, `role="alert"` for errors, screen-reader text for the spinner.
- **Tiny and dependency free.** About 2 kB gzipped, no CSS to import, tree-shakeable ESM and CJS builds.

## Examples

**[Live demo →](https://bar-2020.github.io/react-query-view/)**

An interactive version of every recipe below, deployed to GitHub Pages from [`examples/`](./examples). Each demo has buttons to flip the underlying query between loading, error, empty and success so you can see `QueryView` react in real time, plus a "View source" toggle with the exact code.

Run it locally:

```bash
npm install
npm run build      # examples import the built dist/ output
cd examples
npm install
npm run dev
```

## Why

**Before**

```tsx
function Todos() {
  const query = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

  if (query.isPending) return <Spinner />;
  if (query.isError) return <ErrorMessage onRetry={query.refetch} />;
  if (!query.data || query.data.length === 0) return <EmptyState />;

  return <TodoList todos={query.data} />;
}
```

Repeated in every component, slightly differently each time, and easy to get wrong (forgetting the empty case, or checking `data` before `isError`).

**After**

```tsx
function Todos() {
  const query = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

  return (
    <QueryView
      query={query}
      slotProps={{ error: { onRetry: query.refetch } }}
      successElement={(todos) => <TodoList todos={todos} />}
    />
  );
}
```

## Installation

```bash
npm install react-query-view
```

Peer dependencies: `react >= 18` and `@tanstack/react-query >= 5`.

## Quick start

```tsx
import { useQuery } from '@tanstack/react-query';
import { QueryView } from 'react-query-view';

export function UserList() {
  const query = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

  return (
    <QueryView
      query={query}
      successElement={(users) => (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    />
  );
}
```

## How states are resolved

`QueryView` checks the query in a fixed order and renders the first match:

| Order | Condition                                                  | Renders                    |
| ----- | ---------------------------------------------------------- | -------------------------- |
| 1     | `resolveState(query)` returns a key that exists in `slots` | `slots[key]`               |
| 2     | `query.isPending`                                          | `slots.pending` or default |
| 3     | `query.isError`                                            | `slots.error` or default   |
| 4     | `data === undefined` or `isNoData` is true                 | `slots.noData` or default  |
| 5     | otherwise                                                  | `successElement(data)`     |

## Recipes

### Customise the default nodes

Change text or add a retry button without replacing anything:

```tsx
<QueryView
  query={query}
  slotProps={{
    pending: { title: 'Loading orders' },
    error: {
      title: 'Could not load orders',
      subtitle: 'Check your connection.',
      onRetry: query.refetch,
    },
    noData: { title: 'No orders yet', subtitle: 'New orders will show up here.' },
  }}
  successElement={(orders) => <OrderTable orders={orders} />}
/>
```

### Replace a node

```tsx
<QueryView
  query={query}
  slots={{ pending: <Skeleton rows={5} />, noData: <EmptyInbox /> }}
  successElement={(messages) => <Inbox messages={messages} />}
/>
```

### Set app-wide defaults with `createQueryView`

Define your design system's nodes once and reuse the configured component everywhere. Render functions receive the per-use `slotProps`, so each screen can still adjust the text.

```tsx
// query-view.tsx
import { createQueryView } from 'react-query-view';

export const AppQueryView = createQueryView({
  pending: <Spinner size="lg" />,
  error: (props) => <ErrorCard title={props?.title} onRetry={props?.onRetry} />,
  noData: (props) => <EmptyState title={props?.title ?? 'Nothing here'} />,
});
```

```tsx
<AppQueryView
  query={query}
  slotProps={{ error: { title: 'Could not load projects', onRetry: query.refetch } }}
  successElement={(projects) => <ProjectGrid projects={projects} />}
/>
```

Priority for each slot: per-render `slots` > factory config > built-in default.

### Decide what "empty" means

```tsx
// Paginated response: empty when there are no items
<QueryView
  query={query}
  isNoData={(page) => page.items.length === 0}
  successElement={(page) => <Results page={page} />}
/>

// Always render success, even for []
<QueryView query={query} isNoData={false} successElement={(rows) => <Table rows={rows} />} />
```

### Add custom states with `resolveState`

`resolveState` runs before the built-in checks. Return a slot key to render it, or `null` to continue with the normal flow.

```tsx
<QueryView
  query={query}
  resolveState={() => (query.isRefetchError ? 'refetchError' : null)}
  slots={{ refetchError: <StaleDataBanner onRetry={query.refetch} /> }}
  successElement={(data) => <Dashboard data={data} />}
/>
```

In development, returning a key with no matching slot logs a warning.

### Compose with the default nodes

The built-in nodes are exported, so custom slots can wrap them:

```tsx
import { DefaultErrorNode } from 'react-query-view';

<QueryView
  query={query}
  slots={{
    error: (
      <>
        <DefaultErrorNode title="Payment service unavailable" onRetry={query.refetch} />
        <a href="/status">View system status</a>
      </>
    ),
  }}
  successElement={(invoices) => <Invoices invoices={invoices} />}
/>;
```

## API

### `<QueryView />`

| Prop             | Type                                                          | Description                                                                  |
| ---------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `query`          | `Pick<UseQueryResult<T>, 'data' \| 'isPending' \| 'isError'>` | **Required.** The result of `useQuery` (or any object with these fields).    |
| `successElement` | `(data: T) => ReactNode`                                      | **Required.** Rendered when data is available. `data` is typed as `T`.       |
| `isNoData`       | `boolean \| (data: T) => boolean`                             | Overrides the empty check. Defaults to `null`, `undefined` or empty array.   |
| `slots`          | `{ pending?, error?, noData?, [key]: ReactNode }`             | Replaces a built-in node, or provides nodes for custom `resolveState` keys.  |
| `slotProps`      | `{ pending?, error?, noData? }`                               | Props for the default nodes (see below). Ignored for slots you replaced.     |
| `resolveState`   | `(query) => string \| null`                                   | Runs first. Return a key in `slots` to render it, or `null` to fall through. |

### `createQueryView(config)`

Returns a component with the same props as `QueryView`. Each config key (`pending`, `error`, `noData`) accepts a `ReactNode` or a render function `(slotProps?) => ReactNode`.

### Default nodes

| Component            | Props                                              | Role     |
| -------------------- | -------------------------------------------------- | -------- |
| `DefaultPendingNode` | `title?` (screen-reader label, default `Loading…`) | `status` |
| `DefaultErrorNode`   | `title?`, `subtitle?`, `onRetry?`                  | `alert`  |
| `DefaultNoDataNode`  | `title?`, `subtitle?`                              | `status` |

Styles are inline and inherit the surrounding font, so no stylesheet import is needed.

### Utilities

- `defaultIsNoData(data)`: `true` for `null`, `undefined` or `[]`.
- `resolveIsNoData(data, isNoData?)`: applies an `isNoData` prop the same way `QueryView` does.

All prop and config types (`QueryViewProps`, `CreateQueryViewConfig`, `QueryViewSlots`, ...) are exported.

## Notes

- **Disabled queries.** In TanStack Query v5 a query with `enabled: false` and no cached data reports `isPending: true`, so `QueryView` shows the pending node. If that is not what you want, use `resolveState` to map it to your own slot, for example `resolveState={() => (query.fetchStatus === 'idle' && query.isPending ? 'idle' : null)}` together with `slots={{ idle: <PickAFilter /> }}`.
- **Works with any hook.** `query` only needs `data`, `isPending` and `isError`, so `useSuspenseQuery` results, `useInfiniteQuery` results and plain objects in tests all work.

## Development

```bash
npm install
npm test          # run the test suite
npm run lint      # ESLint
npm run typecheck # tsc
npm run build     # build ESM + CJS + type declarations into dist/
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details, including how [releases are published to npm](./CONTRIBUTING.md#releasing-maintainers) and how the [examples site is deployed](./CONTRIBUTING.md#deploying-the-examples-site).

## License

[MIT](./LICENSE) © Bar-2020
