import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryView } from 'react-query-view';
import { fetchUserPage, type Scenario } from '../api';
import { ScenarioPicker } from '../ScenarioPicker';
import { CodeBlock } from '../CodeBlock';
import source from './CustomEmptyCheck.tsx?raw';

export function CustomEmptyCheck() {
  const [scenario, setScenario] = useState<Scenario>('empty');
  const query = useQuery({
    queryKey: ['user-page', scenario],
    queryFn: () => fetchUserPage(scenario),
  });

  return (
    <section>
      <h2>Decide what &quot;empty&quot; means</h2>
      <p>
        The default empty check only understands <code>null</code>, <code>undefined</code> and{' '}
        <code>[]</code>. A paginated response needs its own <code>isNoData</code> predicate.
      </p>
      <ScenarioPicker value={scenario} onChange={setScenario} />
      <div className="demo-frame">
        <QueryView
          query={query}
          isNoData={(page) => page.items.length === 0}
          successElement={(page) => (
            <ul className="user-list">
              {page.items.map((user) => (
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
