import type { CSSProperties } from 'react';

export interface DefaultPendingNodeProps {
  title?: string;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '40px 24px',
  textAlign: 'center',
};

const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

export const DefaultPendingNode = ({ title = 'Loading…' }: DefaultPendingNodeProps) => {
  return (
    <div role="status" aria-live="polite" style={containerStyle}>
      <style>{`@keyframes rqv-spin { to { transform: rotate(360deg); } }`}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        style={{ animation: 'rqv-spin 0.75s linear infinite' }}
      >
        <circle cx="20" cy="20" r="16" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="#6366f1"
          strokeWidth="4"
          strokeDasharray="25.1 75.4"
          strokeLinecap="round"
        />
      </svg>
      <span style={srOnlyStyle}>{title}</span>
    </div>
  );
};
