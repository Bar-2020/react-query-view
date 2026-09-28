import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryView } from 'react-query-view';
import { fetchUsers, type Scenario } from '../api';
import { ScenarioPicker } from '../ScenarioPicker';
import { CodeBlock } from '../CodeBlock';
import source from './CustomResolveState.tsx?raw';

export function CustomResolveState() {
  const [scenario, setScenario] = useState<Scenario>('success');
  const [rateLimited, setRateLimited] = useState(false);
  const query = useQuery({
    queryKey: ['dashboard', scenario],
    queryFn: () => fetchUsers(scenario),
  });

  return (
    <section>
      <h2>Add a custom state with resolveState</h2>
      <p>
        <code>resolveState</code> runs before the built-in checks. Here it short-circuits to a{' '}
        <code>rateLimited</code> slot regardless of the query&apos;s own status.
      </p>
      <ScenarioPicker value={scenario} onChange={setScenario} />
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={rateLimited}
          onChange={(event) => setRateLimited(event.target.checked)}
        />
        Simulate rate limited (HTTP 429)
      </label>
      <div className="demo-frame">
        <QueryView
          query={query}
          resolveState={() => (rateLimited ? 'rateLimited' : null)}
          slots={{
            rateLimited: (
              <div className="rate-limited" role="alert">
                <p>Too many requests. Try again in a minute.</p>
              </div>
            ),
          }}
          successElement={(users) => (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          )}
        />
      </div>
      <CodeBlock source={source} />
    </section>
  );
}
