import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryView } from 'react-query-view';
import { fetchUsers, type Scenario } from '../api';
import { ScenarioPicker } from '../ScenarioPicker';
import { CodeBlock } from '../CodeBlock';
import source from './ReplaceSlots.tsx?raw';

function Skeleton() {
  return (
    <div className="skeleton-list" aria-hidden="true">
      <div className="skeleton-row" />
      <div className="skeleton-row" />
      <div className="skeleton-row" />
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="empty-inbox">
      <p>📭 Nothing here yet.</p>
    </div>
  );
}

export function ReplaceSlots() {
  const [scenario, setScenario] = useState<Scenario>('slow');
  const query = useQuery({
    queryKey: ['messages', scenario],
    queryFn: () => fetchUsers(scenario),
  });

  return (
    <section>
      <h2>Replace a node entirely</h2>
      <p>
        <code>slots</code> swaps a node for any <code>ReactNode</code> — your own skeleton,
        illustration, or design-system component.
      </p>
      <ScenarioPicker value={scenario} onChange={setScenario} />
      <div className="demo-frame">
        <QueryView
          query={query}
          slots={{ pending: <Skeleton />, noData: <EmptyInbox /> }}
          successElement={(messages) => (
            <ul className="user-list">
              {messages.map((message) => (
                <li key={message.id}>{message.name}</li>
              ))}
            </ul>
          )}
        />
      </div>
      <CodeBlock source={source} />
    </section>
  );
}
