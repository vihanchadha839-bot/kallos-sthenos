import type { Profile } from '../types';

export interface Targets {
  bmr: number;
  tdee: number;
  goalKcal: number;
  kcal: number; // exact Atwater total
  protein: number;
  carbs: number;
  fat: number;
  effectiveGoal: Profile['goal'];
  youth: boolean;
  note: string;
}

export function computeTargets(p: Profile): Targets {
  const youth = p.age < 18;
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'male' ? 5 : -161);
  const tdee = bmr * p.activity;
  const goal = youth ? 'maintain' : p.goal;
  let goalKcal = tdee;
  let note = 'Maintenance: calories match your TDEE.';
  if (goal === 'cut') {
    const floor = p.sex === 'female' ? 1200 : 1500;
    goalKcal = Math.max(tdee * 0.85, Math.min(floor, tdee));
    note = goalKcal > tdee * 0.85 + 1 ? `15% deficit capped by the ${floor} kcal safety floor.` : 'Safe 15% deficit below TDEE.';
  } else if (goal === 'bulk') {
    goalKcal = tdee * 1.12;
    note = 'Lean bulk: 12% surplus above TDEE.';
  } else if (goal === 'recovery') {
    note = 'Recovery/Rehab: maintenance calories with high protein to support tissue repair.';
  }
  if (youth) note = 'Youth Mode (under 18): locked to healthy maintenance with no caloric deficit.';

  const protein = Math.round(1.9 * p.weightKg);
  let fat = Math.round(0.9 * p.weightKg);
  let carbs = Math.round((goalKcal - protein * 4 - fat * 9) / 4);
  if (carbs < 60) {
    fat = Math.round(0.8 * p.weightKg);
    carbs = Math.max(0, Math.round((goalKcal - protein * 4 - fat * 9) / 4));
  }
  const kcal = protein * 4 + carbs * 4 + fat * 9;
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), goalKcal: Math.round(goalKcal), kcal, protein, carbs, fat, effectiveGoal: goal, youth, note };
}

export const atwater = (p: number, c: number, f: number) => p * 4 + c * 4 + f * 9;
