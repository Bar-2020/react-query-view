export type Scenario = 'success' | 'empty' | 'error' | 'slow';

export interface User {
  id: number;
  name: string;
  role: string;
}

const USERS: User[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer' },
  { id: 2, name: 'Grace Hopper', role: 'Engineer' },
  { id: 3, name: 'Katherine Johnson', role: 'Mathematician' },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulates a network call so every example can demo pending, error and empty states on demand. */
export async function fetchUsers(scenario: Scenario): Promise<User[]> {
  await wait(scenario === 'slow' ? 4000 : 700);

  if (scenario === 'error') {
    throw new Error('Failed to load users. The server returned a 500.');
  }

  if (scenario === 'empty') {
    return [];
  }

  return USERS;
}

export interface Page<T> {
  items: T[];
  page: number;
}

/** Same data, wrapped in a paginated shape, for the "custom empty check" example. */
export async function fetchUserPage(scenario: Scenario): Promise<Page<User>> {
  const users = await fetchUsers(scenario);
  return { items: users, page: 1 };
}
