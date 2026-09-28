import type { ReactNode } from 'react';
import type { IsNoDataProp } from './types';

/**
 * Default predicate: returns `true` when data is `null`, `undefined`, or an empty array.
 */
export const defaultIsNoData = <T>(data: T): boolean =>
  data === null || data === undefined || (Array.isArray(data) && data.length === 0);

/**
 * Resolves the effective "is no data" result for a given piece of query data.
 * - `boolean` → returned directly.
 * - `function` → called with data, its return value is used.
 * - `undefined` → falls back to `defaultIsNoData`.
 */
export const resolveIsNoData = <T>(data: T, isNoData?: IsNoDataProp<T>): boolean => {
  if (typeof isNoData === 'boolean') return isNoData;
  if (typeof isNoData === 'function') return isNoData(data);
  return defaultIsNoData(data);
};

/**
 * Resolves a factory slot config into a ReactNode.
 * If `config` is a render function, it is called with `props`.
 * If `config` is a static ReactNode (or undefined), it is returned as-is.
 */
export const resolveFactorySlot = <P>(
  config: ReactNode | ((props?: P) => ReactNode) | undefined,
  props?: P,
): ReactNode | undefined => {
  if (typeof config === 'function') return config(props);
  return config;
};
