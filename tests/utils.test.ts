import { describe, it, expect, vi } from 'vitest';
import { defaultIsNoData, resolveIsNoData, resolveFactorySlot } from '../src/utils';

describe('defaultIsNoData', () => {
  it('returns true for null', () => expect(defaultIsNoData(null)).toBe(true));
  it('returns true for undefined', () => expect(defaultIsNoData(undefined)).toBe(true));
  it('returns true for empty array', () => expect(defaultIsNoData([])).toBe(true));
  it('returns false for non-empty array', () => expect(defaultIsNoData([1])).toBe(false));
  it('returns false for string', () => expect(defaultIsNoData('hello')).toBe(false));
  it('returns false for empty string', () => expect(defaultIsNoData('')).toBe(false));
  it('returns false for number', () => expect(defaultIsNoData(0)).toBe(false));
  it('returns false for object', () => expect(defaultIsNoData({})).toBe(false));
  it('returns false for false', () => expect(defaultIsNoData(false)).toBe(false));
});

describe('resolveIsNoData', () => {
  it('returns boolean directly when passed true', () =>
    expect(resolveIsNoData('data', true)).toBe(true));

  it('returns boolean directly when passed false', () =>
    expect(resolveIsNoData([1, 2, 3], false)).toBe(false));

  it('calls function predicate and returns its result', () => {
    const predicate = vi.fn().mockReturnValue(true);
    expect(resolveIsNoData({ items: [] }, predicate)).toBe(true);
    expect(predicate).toHaveBeenCalledWith({ items: [] });
  });

  it('falls back to defaultIsNoData when undefined', () => {
    expect(resolveIsNoData(null, undefined)).toBe(true);
    expect(resolveIsNoData([], undefined)).toBe(true);
    expect(resolveIsNoData([1], undefined)).toBe(false);
  });
});

describe('resolveFactorySlot', () => {
  it('returns undefined when config is undefined', () =>
    expect(resolveFactorySlot(undefined)).toBeUndefined());

  it('returns ReactNode as-is when config is a static node', () => {
    expect(resolveFactorySlot('hello')).toBe('hello');
    expect(resolveFactorySlot(null)).toBeNull();
  });

  it('calls render function with props and returns its result', () => {
    const render = vi.fn().mockReturnValue('rendered');
    const props = { title: 'test' };
    expect(resolveFactorySlot(render, props)).toBe('rendered');
    expect(render).toHaveBeenCalledWith(props);
  });

  it('calls render function with undefined when no props given', () => {
    const render = vi.fn().mockReturnValue(null);
    resolveFactorySlot(render);
    expect(render).toHaveBeenCalledWith(undefined);
  });
});
