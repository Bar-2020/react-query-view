import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DefaultNoDataNode } from '../../src/default-nodes/DefaultNoDataNode/DefaultNoDataNode';

describe('DefaultNoDataNode', () => {
  it('renders with role="status" and aria-live="polite"', () => {
    render(<DefaultNoDataNode />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('renders default title and subtitle', () => {
    render(<DefaultNoDataNode />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('Nothing to display yet.')).toBeInTheDocument();
  });

  it('renders custom title and subtitle', () => {
    render(<DefaultNoDataNode title="No items" subtitle="Add one to get started." />);
    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('Add one to get started.')).toBeInTheDocument();
  });

  it('renders inbox SVG icon', () => {
    const { container } = render(<DefaultNoDataNode />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
