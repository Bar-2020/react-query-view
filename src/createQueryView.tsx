import type { ReactNode } from 'react';
import type { CreateQueryViewConfig, QueryViewProps, QueryViewSlots } from './types';
import { QueryView } from './QueryView';
import { resolveFactorySlot } from './utils';

/**
 * Creates a pre-configured `QueryView` component with custom default nodes.
 *
 * Slot merge priority (highest → lowest):
 * 1. Per-render `slots.X` override
 * 2. Factory `config.X` (render function receives `slotProps.X`, static node ignores it)
 * 3. `QueryView`'s built-in `<DefaultXNode />` fallback
 *
 * @example
 * // Static nodes
 * const MyQueryView = createQueryView({
 *   pending: <Spinner />,
 *   error: <ErrorCard />,
 *   noData: <EmptyState />,
 * });
 *
 * @example
 * // Render functions — receive per-instance slotProps
 * const MyQueryView = createQueryView({
 *   error: (props) => <ErrorCard title={props?.title} onRetry={props?.onRetry} />,
 * });
 *
 * // Later, pass slotProps to customise the factory node per-use:
 * <MyQueryView
 *   query={query}
 *   slotProps={{ error: { title: 'Custom error', onRetry: refetch } }}
 *   successElement={(data) => <List items={data} />}
 * />
 */
export function createQueryView(config: CreateQueryViewConfig) {
  const ConfiguredQueryView = <T,>(props: QueryViewProps<T>): ReactNode => {
    const mergedSlots: QueryViewSlots = {
      pending:
        props.slots?.pending !== undefined
          ? props.slots.pending
          : resolveFactorySlot(config.pending, props.slotProps?.pending),
      error:
        props.slots?.error !== undefined
          ? props.slots.error
          : resolveFactorySlot(config.error, props.slotProps?.error),
      noData:
        props.slots?.noData !== undefined
          ? props.slots.noData
          : resolveFactorySlot(config.noData, props.slotProps?.noData),
      // Forward any custom slot keys (used with resolveState) unchanged.
      ...props.slots,
    };

    return <QueryView {...props} slots={mergedSlots} />;
  };

  ConfiguredQueryView.displayName = 'ConfiguredQueryView';

  return ConfiguredQueryView;
}
