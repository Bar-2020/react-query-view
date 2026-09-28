import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryView } from 'react-query-view';
import { fetchUsers, type Scenario } from '../api';
import { ScenarioPicker } from '../ScenarioPicker';
import { CodeBlock } from '../CodeBlock';
import source from './QuickStart.tsx?raw';

export function QuickStart() {
  const [scenario, setScenario] = useState<Scenario>('success');
  const query = useQuery({ queryKey: ['users', scenario], queryFn: () => fetchUsers(scenario) });

  return (
    <section>
      <h2>Quick start</h2>
      <p>
        The minimal setup: pass a <code>query</code> and a <code>successElement</code>.{' '}
        <code>QueryView</code> picks the right node automatically.
      </p>
      <ScenarioPicker value={scenario} onChange={setScenario} />
      <div className="demo-frame">
        <QueryView
          query={query}
          successElement={(users) => (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id}>
                  {user.name} — {user.role}
                </li>
              ))}
            </ul>
          )}
        />
      </div>
      <CodeBlock source={source} />
    </section>
  );
}
