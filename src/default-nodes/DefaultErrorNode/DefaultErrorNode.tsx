import type { CSSProperties } from 'react';

export interface DefaultErrorNodeProps {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '40px 24px',
  textAlign: 'center',
};

const titleStyle: CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
  fontFamily: 'inherit',
};

const subtitleStyle: CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  margin: 0,
  fontFamily: 'inherit',
};

const retryButtonStyle: CSSProperties = {
  marginTop: '8px',
  padding: '7px 18px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  background: 'white',
  color: '#374151',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  lineHeight: 1.5,
};

export const DefaultErrorNode = ({
  title = 'Something went wrong',
  subtitle = 'An unexpected error occurred.',
  onRetry,
}: DefaultErrorNodeProps) => {
  return (
    <div role="alert" aria-live="assertive" style={containerStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="9"
          x2="12"
          y2="13"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17" r="0.5" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
      <p style={titleStyle}>{title}</p>
      <p style={subtitleStyle}>{subtitle}</p>
      {onRetry !== undefined && (
        <button type="button" onClick={onRetry} style={retryButtonStyle}>
          Try again
        </button>
      )}
    </div>
  );
};
