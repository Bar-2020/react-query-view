import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryView } from '../src/QueryView';
import type { NarrowedUseQueryResult } from '../src/types';

const pending: NarrowedUseQueryResult<string[]> = {
  data: undefined,
  isPending: true,
  isError: false,
};

const errored: NarrowedUseQueryResult<string[]> = {
  data: undefined,
  isPending: false,
  isError: true,
};

const noData: NarrowedUseQueryResult<string[]> = {
  data: undefined,
  isPending: false,
  isError: false,
};

const emptyArray: NarrowedUseQueryResult<string[]> = {
  data: [],
  isPending: false,
  isError: false,
};

const success: NarrowedUseQueryResult<string[]> = {
  data: ['alpha', 'beta'],
  isPending: false,
  isError: false,
};

const successEl = (data: string[]) => (
  <ul>
    {data.map((d) => (
      <li key={d}>{d}</li>
    ))}
  </ul>
);

describe('QueryView — built-in states', () => {
  it('renders default pending node when isPending', () => {
    render(<QueryView query={pending} successElement={successEl} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders default error node when isError', () => {
    render(<QueryView query={errored} successElement={successEl} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders default noData node when data is undefined', () => {
    render(<QueryView query={noData} successElement={successEl} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders default noData node when data is empty array', () => {
    render(<QueryView query={emptyArray} successElement={successEl} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders successElement when data is present', () => {
    render(<QueryView query={success} successElement={successEl} />);
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
  });
});

describe('QueryView — slots override', () => {
  it('uses custom pending slot', () => {
    render(
      <QueryView
        query={pending}
        slots={{ pending: <div>custom pending</div> }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('custom pending')).toBeInTheDocument();
  });

  it('uses custom error slot', () => {
    render(
      <QueryView
        query={errored}
        slots={{ error: <div>custom error</div> }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('custom error')).toBeInTheDocument();
  });

  it('uses custom noData slot', () => {
    render(
      <QueryView
        query={noData}
        slots={{ noData: <div>custom no data</div> }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('custom no data')).toBeInTheDocument();
  });
});

describe('QueryView — slotProps', () => {
  it('passes title to default pending node', () => {
    render(
      <QueryView
        query={pending}
        slotProps={{ pending: { title: 'Fetching…' } }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('Fetching…')).toBeInTheDocument();
  });

  it('passes title/subtitle to default error node', () => {
    render(
      <QueryView
        query={errored}
        slotProps={{ error: { title: 'Oops!', subtitle: 'Try later.' } }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Try later.')).toBeInTheDocument();
  });

  it('passes title/subtitle to default noData node', () => {
    render(
      <QueryView
        query={noData}
        slotProps={{ noData: { title: 'Empty', subtitle: 'Add some items.' } }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(screen.getByText('Add some items.')).toBeInTheDocument();
  });
});

describe('QueryView — isNoData prop', () => {
  it('treats non-empty array as no data when isNoData=true', () => {
    render(<QueryView query={success} isNoData={true} successElement={successEl} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('treats empty array as data when isNoData=false', () => {
    const successFn = vi.fn().mockReturnValue(<div>shown</div>);
    render(<QueryView query={emptyArray} isNoData={false} successElement={successFn} />);
    expect(screen.getByText('shown')).toBeInTheDocument();
  });

  it('uses predicate function', () => {
    const hasItems: NarrowedUseQueryResult<{ items: string[] }> = {
      data: { items: [] },
      isPending: false,
      isError: false,
    };
    render(
      <QueryView
        query={hasItems}
        isNoData={(d) => d.items.length === 0}
        successElement={() => <div>shown</div>}
      />,
    );
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});

describe('QueryView — resolveState', () => {
  it('renders custom slot when resolveState returns matching key', () => {
    const withCustomState = { ...errored };
    render(
      <QueryView
        query={withCustomState}
        resolveState={() => 'rateLimit'}
        slots={{ rateLimit: <div>Rate limited</div> }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('Rate limited')).toBeInTheDocument();
  });

  it('falls through when resolveState returns null', () => {
    render(<QueryView query={errored} resolveState={() => null} successElement={successEl} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('falls through when resolveState returns key with no matching slot', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <QueryView query={pending} resolveState={() => 'unknownKey'} successElement={successEl} />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"unknownKey"'));
    warn.mockRestore();
  });

  it('does not warn when resolveState returns null', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<QueryView query={pending} resolveState={() => null} successElement={successEl} />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('evaluates resolveState before isPending check', () => {
    render(
      <QueryView
        query={pending}
        resolveState={() => 'earlyExit'}
        slots={{ earlyExit: <div>early</div> }}
        successElement={successEl}
      />,
    );
    expect(screen.getByText('early')).toBeInTheDocument();
  });
});
