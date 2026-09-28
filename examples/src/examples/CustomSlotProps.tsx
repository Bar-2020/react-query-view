import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryView } from 'react-query-view';
import { fetchUsers, type Scenario } from '../api';
import { ScenarioPicker } from '../ScenarioPicker';
import { CodeBlock } from '../CodeBlock';
import source from './CustomSlotProps.tsx?raw';

export function CustomSlotProps() {
  const [scenario, setScenario] = useState<Scenario>('error');
  const query = useQuery({
    queryKey: ['orders', scenario],
    queryFn: () => fetchUsers(scenario),
  });

  return (
    <section>
      <h2>Customise the default nodes</h2>
      <p>
        Change the text on the built-in nodes, or wire up a retry button, with{' '}
        <code>slotProps</code>. No need to replace the node itself.
      </p>
      <ScenarioPicker value={scenario} onChange={setScenario} />
      <div className="demo-frame">
        <QueryView
          query={query}
          slotProps={{
            pending: { title: 'Loading orders' },
            error: {
              title: 'Could not load orders',
              subtitle: 'Check your connection.',
              onRetry: query.refetch,
            },
            noData: { title: 'No orders yet', subtitle: 'New orders will show up here.' },
          }}
          successElement={(orders) => (
            <ul className="user-list">
              {orders.map((order) => (
                <li key={order.id}>{order.name}</li>
              ))}
            </ul>
          )}
        />
      </div>
      <CodeBlock source={source} />
    </section>
  );
}
