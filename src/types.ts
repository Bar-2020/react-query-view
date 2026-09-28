import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { DefaultPendingNodeProps } from './default-nodes/DefaultPendingNode/DefaultPendingNode';
import type { DefaultErrorNodeProps } from './default-nodes/DefaultErrorNode/DefaultErrorNode';
import type { DefaultNoDataNodeProps } from './default-nodes/DefaultNoDataNode/DefaultNoDataNode';

/**
 * A narrowed version of UseQueryResult containing only the properties needed by `QueryView`.
 * Using Pick keeps the coupling minimal and allows passing plain mock objects in tests.
 */
export type NarrowedUseQueryResult<T> = Pick<UseQueryResult<T>, 'data' | 'isPending' | 'isError'>;

/**
 * Determines whether resolved query data should be treated as "no data".
 * - `boolean`: directly sets the no-data condition.
 * - `(data: T) => boolean`: predicate called with the resolved data.
 */
export type IsNoDataProp<T> = boolean | ((data: T) => boolean);

/**
 * Called before built-in state checks. Return a slot key to render that slot,
 * or `null` to fall through to the default pending → error → noData → success flow.
 */
export type ResolveStateFn<T> = (query: NarrowedUseQueryResult<T>) => string | null;

/**
 * Custom ReactNode overrides for each lifecycle slot.
 * Accepts arbitrary string keys to support custom states via `resolveState`.
 */
export interface QueryViewSlots {
  pending?: ReactNode;
  error?: ReactNode;
  noData?: ReactNode;
  [key: string]: ReactNode;
}

/**
 * Props forwarded to the built-in default nodes.
 * Ignored for any slot that has a custom override in `slots`.
 */
export interface QueryViewSlotProps {
  pending?: DefaultPendingNodeProps;
  error?: DefaultErrorNodeProps;
  noData?: DefaultNoDataNodeProps;
}

/**
 * Props for the `QueryView` component.
 */
export interface QueryViewProps<T> {
  /** The result object from `useQuery` or a compatible custom hook. */
  query: NarrowedUseQueryResult<T>;
  /**
   * Determines whether resolved data should be treated as "no data".
   * Defaults to `true` when data is `null`, `undefined`, or an empty array.
   */
  isNoData?: IsNoDataProp<T>;
  /**
   * Renders the main UI when data is available.
   * Receives data guaranteed to be defined at this point.
   */
  successElement: (data: T) => ReactNode;
  /**
   * Fully replaces a default slot with a custom ReactNode.
   * Supports arbitrary keys for use with `resolveState`.
   */
  slots?: QueryViewSlots;
  /**
   * Props forwarded to the default node for each built-in slot.
   * Has no effect for slots with a custom override in `slots`.
   */
  slotProps?: QueryViewSlotProps;
  /**
   * Called before built-in state checks. Return a slot key to short-circuit
   * to that slot, or `null` to fall through to the default flow.
   *
   * @example
   * resolveState={(query) => (query.isRefetchError ? 'refetchError' : null)}
   * slots={{ refetchError: <RefetchErrorBanner /> }}
   */
  resolveState?: ResolveStateFn<T>;
}

/**
 * Configuration passed to `createQueryView`.
 * Each slot accepts a static ReactNode or a render function that receives
 * the corresponding `slotProps` entry, enabling per-instance customisation.
 */
export interface CreateQueryViewConfig {
  pending?: ReactNode | ((props?: DefaultPendingNodeProps) => ReactNode);
  error?: ReactNode | ((props?: DefaultErrorNodeProps) => ReactNode);
  noData?: ReactNode | ((props?: DefaultNoDataNodeProps) => ReactNode);
}
