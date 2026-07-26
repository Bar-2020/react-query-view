import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DefaultPendingNode } from '../../src/default-nodes/DefaultPendingNode/DefaultPendingNode';

describe('DefaultPendingNode', () => {
  it('renders with role="status" and aria-live="polite"', () => {
    render(<DefaultPendingNode />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('renders default title text for screen readers', () => {
    render(<DefaultPendingNode />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders custom title text', () => {
    render(<DefaultPendingNode title="Fetching posts…" />);
    expect(screen.getByText('Fetching posts…')).toBeInTheDocument();
  });

  it('renders the spinner SVG', () => {
    const { container } = render(<DefaultPendingNode />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
