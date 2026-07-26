import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultErrorNode } from '../../src/default-nodes/DefaultErrorNode/DefaultErrorNode';

describe('DefaultErrorNode', () => {
  it('renders with role="alert" and aria-live="assertive"', () => {
    render(<DefaultErrorNode />);
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders default title and subtitle', () => {
    render(<DefaultErrorNode />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
  });

  it('renders custom title and subtitle', () => {
    render(<DefaultErrorNode title="Oops!" subtitle="Please try again." />);
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Please try again.')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<DefaultErrorNode />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<DefaultErrorNode onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<DefaultErrorNode onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders warning SVG icon', () => {
    const { container } = render(<DefaultErrorNode />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
