import type { Scenario } from './api';

const OPTIONS: { value: Scenario; label: string }[] = [
  { value: 'success', label: 'Success' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' },
  { value: 'slow', label: 'Slow (4s)' },
];

interface ScenarioPickerProps {
  value: Scenario;
  onChange: (scenario: Scenario) => void;
}

/** Lets a visitor flip between the states QueryView handles, without a real backend. */
export function ScenarioPicker({ value, onChange }: ScenarioPickerProps) {
  return (
    <div className="scenario-picker" role="group" aria-label="Simulated query result">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? 'scenario-button active' : 'scenario-button'}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
