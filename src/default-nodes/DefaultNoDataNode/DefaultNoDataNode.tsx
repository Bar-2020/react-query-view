import type { CSSProperties } from 'react';

export interface DefaultNoDataNodeProps {
  title?: string;
  subtitle?: string;
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

export const DefaultNoDataNode = ({
  title = 'No data',
  subtitle = 'Nothing to display yet.',
}: DefaultNoDataNodeProps) => {
  return (
    <div role="status" aria-live="polite" style={containerStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M22 12H16L14 15H10L8 12H2"
          stroke="#9ca3af"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"
          stroke="#9ca3af"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p style={titleStyle}>{title}</p>
      <p style={subtitleStyle}>{subtitle}</p>
    </div>
  );
};
