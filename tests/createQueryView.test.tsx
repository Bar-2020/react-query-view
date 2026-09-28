import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createQueryView } from '../src/createQueryView';
import type { NarrowedUseQueryResult } from '../src/types';

const pending: NarrowedUseQueryResult<string> = {
  data: undefined,
  isPending: true,
  isError: false,
};

const errored: NarrowedUseQueryResult<string> = {
  data: undefined,
  isPending: false,
  isError: true,
};

const noData: NarrowedUseQueryResult<string> = {
  data: undefined,
  isPending: false,
  isError: false,
};

const success: NarrowedUseQueryResult<string> = {
  data: 'hello',
  isPending: false,
  isError: false,
};

describe('createQueryView — factory defaults', () => {
  it('uses static pending node from factory config', () => {
    const MyView = createQueryView({ pending: <div>factory pending</div> });
    render(<MyView query={pending} successElement={(d) => <span>{d}</span>} />);
    expect(screen.getByText('factory pending')).toBeInTheDocument();
  });

  it('uses static error node from factory config', () => {
    const MyView = createQueryView({ error: <div>factory error</div> });
    render(<MyView query={errored} successElement={(d) => <span>{d}</span>} />);
    expect(screen.getByText('factory error')).toBeInTheDocument();
  });

  it('uses static noData node from factory config', () => {
    const MyView = createQueryView({ noData: <div>factory no data</div> });
    render(<MyView query={noData} successElement={(d) => <span>{d}</span>} />);
    expect(screen.getByText('factory no data')).toBeInTheDocument();
  });

  it('uses render function and forwards slotProps', () => {
    const MyView = createQueryView({
      error: (props) => <div>title: {props?.title ?? 'default'}</div>,
    });
    render(
      <MyView
        query={errored}
        slotProps={{ error: { title: 'Custom' } }}
        successElement={(d) => <span>{d}</span>}
      />,
    );
    expect(screen.getByText('title: Custom')).toBeInTheDocument();
  });

  it('calls render function with undefined props when slotProps not provided', () => {
    const renderFn = vi.fn().mockReturnValue(<div>rendered</div>);
    const MyView = createQueryView({ pending: renderFn });
    render(<MyView query={pending} successElement={(d) => <span>{d}</span>} />);
    expect(renderFn).toHaveBeenCalledWith(undefined);
  });
});

describe('createQueryView — per-render slots override factory', () => {
  it('per-render slot wins over factory static node', () => {
    const MyView = createQueryView({ pending: <div>factory pending</div> });
    render(
      <MyView
        query={pending}
        slots={{ pending: <div>runtime pending</div> }}
        successElement={(d) => <span>{d}</span>}
      />,
    );
    expect(screen.getByText('runtime pending')).toBeInTheDocument();
    expect(screen.queryByText('factory pending')).not.toBeInTheDocument();
  });

  it('keeps the factory node when a per-render slot is explicitly undefined', () => {
    const MyView = createQueryView({ pending: <div>factory pending</div> });
    render(
      <MyView
        query={pending}
        slots={{ pending: undefined }}
        successElement={(d) => <span>{d}</span>}
      />,
    );
    expect(screen.getByText('factory pending')).toBeInTheDocument();
  });

  it('forwards custom slot keys for use with resolveState', () => {
    const MyView = createQueryView({ pending: <div>factory pending</div> });
    render(
      <MyView
        query={pending}
        resolveState={() => 'maintenance'}
        slots={{ maintenance: <div>down for maintenance</div> }}
        successElement={(d) => <span>{d}</span>}
      />,
    );
    expect(screen.getByText('down for maintenance')).toBeInTheDocument();
  });

  it('falls back to built-in default when neither factory nor per-render slot set', () => {
    const MyView = createQueryView({});
    render(<MyView query={errored} successElement={(d) => <span>{d}</span>} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

describe('createQueryView — success path', () => {
  it('still renders successElement when data is available', () => {
    const MyView = createQueryView({
      pending: <div>loading</div>,
      error: <div>err</div>,
    });
    render(<MyView query={success} successElement={(d) => <span>data: {d}</span>} />);
    expect(screen.getByText('data: hello')).toBeInTheDocument();
  });
});
