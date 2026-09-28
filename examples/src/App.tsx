import { useState } from 'react';
import { QuickStart } from './examples/QuickStart';
import { CustomSlotProps } from './examples/CustomSlotProps';
import { ReplaceSlots } from './examples/ReplaceSlots';
import { AppWideDefaults } from './examples/AppWideDefaults';
import { CustomEmptyCheck } from './examples/CustomEmptyCheck';
import { CustomResolveState } from './examples/CustomResolveState';

const TABS = [
  { id: 'quick-start', label: 'Quick start', Component: QuickStart },
  { id: 'slot-props', label: 'Custom text', Component: CustomSlotProps },
  { id: 'replace-slots', label: 'Replace a node', Component: ReplaceSlots },
  { id: 'app-defaults', label: 'App-wide defaults', Component: AppWideDefaults },
  { id: 'empty-check', label: 'Custom empty check', Component: CustomEmptyCheck },
  { id: 'resolve-state', label: 'Custom state', Component: CustomResolveState },
] as const;

export function App() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('quick-start');
  const ActiveExample = TABS.find((tab) => tab.id === activeTab)?.Component ?? QuickStart;

  return (
    <div className="app">
      <header className="app-header">
        <h1>react-query-view</h1>
        <p>
          Live examples of the <code>QueryView</code> component. Use the buttons inside each demo to
          switch between loading, error, empty and success states.
        </p>
        <p className="app-links">
          <a href="https://github.com/Bar-2020/react-query-view">GitHub</a>
          {' · '}
          <a href="https://www.npmjs.com/package/react-query-view">npm</a>
        </p>
      </header>

      <nav className="tabs" aria-label="Examples">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
            aria-current={tab.id === activeTab}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        <ActiveExample />
      </main>
    </div>
  );
}
