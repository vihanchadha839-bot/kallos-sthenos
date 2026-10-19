import type { Benchmarks } from '../types';

const CAPS: Benchmarks = { pushups: 50, pullups: 20, dips: 25, plank: 180, lsit: 30, hlr: 20, handstand: 90, slsquat: 12 };

export const LEVELS = [
  { name: 'Initiate', min: 0 },
  { name: 'Novice', min: 12 },
  { name: 'Intermediate', min: 30 },
  { name: 'Advanced', min: 50 },
  { name: 'Elite', min: 70 },
  { name: 'Master', min: 88 },
];

export function benchScore(b: Benchmarks): number {
  const keys = Object.keys(CAPS) as (keyof Benchmarks)[];
  const sum = keys.reduce((s, k) => s + Math.min(1, Math.max(0, (b[k] || 0) / CAPS[k])), 0);
  return Math.round((sum / keys.length) * 100);
}

export function levelInfo(b: Benchmarks) {
  const score = benchScore(b);
  let idx = 0;
  LEVELS.forEach((l, i) => { if (score >= l.min) idx = i; });
  const next = LEVELS[idx + 1];
  const progress = next ? (score - LEVELS[idx].min) / (next.min - LEVELS[idx].min) : 1;
  // Training difficulty level 1 to 5
  const train = Math.min(5, idx + 1);
  return { score, idx, name: LEVELS[idx].name, next: next?.name, nextMin: next?.min, progress, train };
}
