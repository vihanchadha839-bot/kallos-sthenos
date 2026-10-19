import { EXERCISES, EX_BY_ID } from '../data/exercises';
import type { DayPlan, DayType, Equip, Exercise, PlannedExercise, Profile, WorkoutSchedule } from '../types';
import { levelInfo } from './level';

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const R: DayType = 'Rest';
export const SPLITS: Record<number, DayType[]> = {
  1: [R, R, R, 'Full Body', R, R, R],
  2: ['Upper', R, R, 'Lower', R, R, R],
  3: ['Push', R, 'Pull', R, 'Legs', R, R],
  4: ['Upper', R, 'Lower', R, 'Upper', R, 'Lower'],
  5: ['Push', 'Pull', 'Legs', R, 'Upper', 'Lower', R],
  6: ['Push', 'Pull', 'Legs', R, 'Push', 'Pull', 'Legs'],
  7: ['Upper', 'Lower', 'Push', 'Pull', 'Legs', 'Upper', 'Lower'],
};

export const DAY_FOCUS: Record<DayType, string> = {
  Push: 'Chest, shoulders, triceps + core. Zero legs.',
  Pull: 'Back, biceps, forearms + core. Zero legs.',
  Legs: 'Quads, hamstrings, glutes, calves, tibialis. Zero upper body.',
  Upper: 'Upper push + pull + upper core. Zero legs.',
  Lower: 'Quads, hamstrings, glutes, calves, tibialis + lower core. Zero upper.',
  'Full Body': 'Push, pull, legs and core in one session.',
  Rest: 'Active recovery: walk, mobility and rehab warm-ups.',
};

const has = (equip: Equip[]) => (e: Exercise) => e.equip.every((q) => equip.includes(q));

/** Every exercise legal for a given day type (equipment-agnostic). Enforces strict muscle discipline. */
export function dayPool(type: DayType): Exercise[] {
  return EXERCISES.filter((e) => {
    switch (type) {
      case 'Push': return e.cat === 'push' || (e.cat === 'core' && e.zone === 'upper');
      case 'Pull': return e.cat === 'pull' || (e.cat === 'core' && e.zone === 'upper');
      case 'Legs': return e.cat === 'legs';
      case 'Upper': return e.cat === 'push' || e.cat === 'pull' || (e.cat === 'core' && e.zone === 'upper');
      case 'Lower': return e.cat === 'legs' || (e.cat === 'core' && e.zone === 'lower');
      case 'Full Body': return true;
      default: return false;
    }
  });
}

function rotate<T>(arr: T[], n: number): T[] {
  if (!arr.length) return arr;
  const k = n % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

function interleave(lists: Exercise[][]): Exercise[] {
  const out: Exercise[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
}

export function prescribe(e: Exercise, level: number, duration: number): PlannedExercise {
  const gap = e.diff - level;
  let target: string;
  let workSec: number;
  if (e.mode === 'hold') {
    const hold = gap >= 2 ? 10 : gap === 1 ? 15 : gap === 0 ? 20 : gap === -1 ? 30 : 45;
    target = `${hold}s hold`;
    workSec = hold + 10;
  } else {
    target = gap >= 2 ? '3-5 reps (use negatives)' : gap === 1 ? '4-6 reps' : gap === 0 ? '6-10 reps' : gap === -1 ? '8-12 reps' : '12-20 reps';
    workSec = gap >= 1 ? 35 : gap === 0 ? 40 : 45;
  }
  const restSec = e.diff >= 4 ? 90 : e.diff === 3 ? 75 : e.cat === 'core' ? 45 : 60;
  const sets: 2 | 3 = duration >= 75 ? 3 : duration >= 45 ? (e.diff >= 3 && e.cat !== 'core' ? 3 : 2) : 2;
  return { id: e.id, sets, target, workSec, restSec };
}

export const exerciseSeconds = (p: PlannedExercise) => p.sets * (p.workSec + p.restSec);
export const dayMinutes = (d: DayPlan) => Math.round(d.exercises.reduce((s, p) => s + exerciseSeconds(p), 0) / 60);

function buildDay(type: DayType, occurrence: number, profile: Profile, level: number): PlannedExercise[] {
  const ok = has(profile.equipment);
  const pool = dayPool(type).filter(ok).filter((e) => e.diff <= level + 2);
  const byFit = (a: Exercise, b: Exercise) => Math.abs(a.diff - level) - Math.abs(b.diff - level) || b.diff - a.diff;
  const group = (pred: (e: Exercise) => boolean) => rotate(pool.filter(pred).sort(byFit), occurrence * 3);

  let main: Exercise[];
  if (type === 'Upper') main = interleave([group((e) => e.cat === 'push'), group((e) => e.cat === 'pull')]);
  else if (type === 'Full Body') main = interleave([group((e) => e.cat === 'push'), group((e) => e.cat === 'pull'), group((e) => e.cat === 'legs')]);
  else main = group((e) => e.cat !== 'core');
  const core = group((e) => e.cat === 'core');

  // Core inserted after every 3 main movements
  const ordered: Exercise[] = [];
  let ci = 0;
  main.forEach((e, i) => {
    ordered.push(e);
    if ((i + 1) % 3 === 0 && core[ci]) ordered.push(core[ci++]);
  });
  while (ci < core.length) ordered.push(core[ci++]);

  const budget = profile.duration * 60;
  const out: PlannedExercise[] = [];
  let used = 0;
  for (const e of ordered) {
    const p = prescribe(e, level, profile.duration);
    const cost = exerciseSeconds(p);
    if (used + cost <= budget) { out.push(p); used += cost; }
    if (budget - used < 150) break;
  }
  return out;
}

export function scheduleSignature(p: Profile): string {
  const lvl = levelInfo(p.benchmarks).train;
  return JSON.stringify([p.days, p.duration, [...p.equipment].sort(), lvl]);
}

export function generateSchedule(p: Profile): WorkoutSchedule {
  const level = levelInfo(p.benchmarks).train;
  const split = SPLITS[p.days] ?? SPLITS[3];
  const seen: Record<string, number> = {};
  const days: DayPlan[] = split.map((type, i) => {
    if (type === 'Rest') return { day: WEEKDAYS[i], type, exercises: [] };
    const occ = (seen[type] = (seen[type] ?? -1) + 1);
    const exercises = buildDay(type, occ, p, level);
    const note = exercises.length < 4 ? 'Limited options with your equipment. Add a pull-up bar, bands or bench for more variety.' : undefined;
    return { day: WEEKDAYS[i], type, exercises, note };
  });
  return { sig: scheduleSignature(p), days };
}

/** Equivalent movements: same day pool, same category, sharing the primary muscle. */
export function swapOptions(type: DayType, currentId: string, inDay: string[], equip: Equip[]): Exercise[] {
  const cur = EX_BY_ID[currentId];
  if (!cur) return [];
  const pool = dayPool(type).filter(has(equip)).filter((e) => e.cat === cur.cat && !inDay.includes(e.id));
  const primary = cur.muscles[0];
  const exact = pool.filter((e) => e.muscles[0] === primary);
  const near = pool.filter((e) => e.muscles[0] !== primary && e.muscles.includes(primary));
  return [...exact, ...near].sort((a, b) => a.diff - b.diff);
}
