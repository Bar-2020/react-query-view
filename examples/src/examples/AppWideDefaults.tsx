import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createQueryView } from 'react-query-view';
import type { DefaultErrorNodeProps } from 'react-query-view';
import { fetchUsers, type Scenario } from '../api';
import { ScenarioPicker } from '../ScenarioPicker';
import { CodeBlock } from '../CodeBlock';
import source from './AppWideDefaults.tsx?raw';

// Defined once, outside the component, exactly as you would in a `query-view.tsx`
// shared across a real app.
const AppQueryView = createQueryView({
  pending: (
    <div className="brand-spinner" role="status" aria-live="polite">
      <span className="spinner-dot" />
      <span className="spinner-dot" />
      <span className="spinner-dot" />
    </div>
  ),
  error: (props?: DefaultErrorNodeProps) => (
    <div className="brand-error" role="alert">
      <strong>{props?.title ?? 'Something broke'}</strong>
      {props?.onRetry && (
        <button type="button" onClick={props.onRetry} className="scenario-button">
          Retry
        </button>
      )}
    </div>
  ),
  noData: (props) => <p className="brand-empty">{props?.title ?? 'Nothing here'}</p>,
});

export function AppWideDefaults() {
  const [scenario, setScenario] = useState<Scenario>('success');
  const query = useQuery({
    queryKey: ['projects', scenario],
    queryFn: () => fetchUsers(scenario),
  });

  return (
    <section>
      <h2>App-wide defaults with createQueryView</h2>
      <p>
        Define your design system&apos;s pending/error/empty nodes once. Every screen still controls
        its own text through <code>slotProps</code>.
      </p>
      <ScenarioPicker value={scenario} onChange={setScenario} />
      <div className="demo-frame">
        <AppQueryView
          query={query}
          slotProps={{ error: { title: 'Could not load projects', onRetry: query.refetch } }}
          successElement={(projects) => (
            <ul className="user-list">
              {projects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          )}
        />
      </div>
      <CodeBlock source={source} />
    </section>
  );
}
