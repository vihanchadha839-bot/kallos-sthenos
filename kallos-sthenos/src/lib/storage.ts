export const KEYS = {
  profile: 'kallos_user_profile',
  workout: 'kallos_workout_schedule',
  meals: 'kallos_meal_plan',
  sessions: 'kallos_completed_sessions',
  benchLog: 'kallos_benchmark_log',
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: ignore */
  }
}
