import type { ReactNode } from 'react';
import type { QueryViewProps } from './types';
import { DefaultPendingNode } from './default-nodes/DefaultPendingNode/DefaultPendingNode';
import { DefaultErrorNode } from './default-nodes/DefaultErrorNode/DefaultErrorNode';
import { DefaultNoDataNode } from './default-nodes/DefaultNoDataNode/DefaultNoDataNode';
import { resolveIsNoData } from './utils';

/**
 * Renders the appropriate UI for each TanStack Query lifecycle state:
 * pending, error, no data, or success.
 *
 * State resolution order:
 * 1. `resolveState` (custom — evaluated first, before built-in checks)
 * 2. `isPending`
 * 3. `isError`
 * 4. `data === undefined` or `isNoData` predicate
 * 5. Success — `successElement(data)` with data narrowed to `T`
 *
 * @example
 * // Default nodes
 * <QueryView query={query} successElement={(data) => <List items={data} />} />
 *
 * @example
 * // Custom slot props
 * <QueryView
 *   query={query}
 *   slotProps={{ error: { title: 'Failed to load', onRetry: refetch } }}
 *   successElement={(data) => <List items={data} />}
 * />
 *
 * @example
 * // Fully custom nodes
 * <QueryView
 *   query={query}
 *   slots={{ pending: <Spinner />, error: <ErrorCard />, noData: <Empty /> }}
 *   successElement={(data) => <List items={data} />}
 * />
 *
 * @example
 * // Custom states via resolveState
 * <QueryView
 *   query={query}
 *   resolveState={(q) => (q.isRefetchError ? 'refetchError' : null)}
 *   slots={{ refetchError: <RefetchErrorBanner /> }}
 *   successElement={(data) => <List items={data} />}
 * />
 */
export const QueryView = <T,>({
  query,
  isNoData,
  successElement,
  slots,
  slotProps,
  resolveState,
}: QueryViewProps<T>): ReactNode => {
  // Custom state — evaluated before all built-in checks.
  if (resolveState !== undefined) {
    const customKey = resolveState(query);
    if (customKey !== null && slots !== undefined && slots[customKey] !== undefined) {
      return slots[customKey];
    }
  }

  const { data, isPending, isError } = query;

  if (isPending) {
    return slots?.pending ?? <DefaultPendingNode {...slotProps?.pending} />;
  }

  if (isError) {
    return slots?.error ?? <DefaultErrorNode {...slotProps?.error} />;
  }

  if (data === undefined || resolveIsNoData(data, isNoData)) {
    return slots?.noData ?? <DefaultNoDataNode {...slotProps?.noData} />;
  }

  return successElement(data);
};
