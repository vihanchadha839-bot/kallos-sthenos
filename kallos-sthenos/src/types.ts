export type Units = 'metric' | 'imperial';
export type Sex = 'male' | 'female';
export type Goal = 'cut' | 'bulk' | 'maintain' | 'recovery';
export type Diet = 'standard' | 'vegetarian' | 'vegan' | 'pescatarian';
export type Allergen = 'dairy' | 'gluten' | 'nuts' | 'peanuts' | 'eggs' | 'fish' | 'shellfish' | 'soy';
export type Equip = 'pullbar' | 'dipbars' | 'rings' | 'bands' | 'bench' | 'wall';

export interface Benchmarks {
  pushups: number;
  pullups: number;
  dips: number;
  plank: number;
  lsit: number;
  hlr: number;
  handstand: number;
  slsquat: number;
}

export interface Profile {
  units: Units;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activity: number;
  goal: Goal;
  benchmarks: Benchmarks;
  days: number;
  duration: number;
  equipment: Equip[];
  diet: Diet;
  allergens: Allergen[];
}

export type Muscle =
  | 'chest' | 'shoulders' | 'triceps' | 'back' | 'biceps' | 'forearms'
  | 'abs' | 'obliques' | 'lowerback'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'tibialis' | 'adductors';

export type Category = 'push' | 'pull' | 'legs' | 'core';

export interface Exercise {
  id: string;
  name: string;
  cat: Category;
  muscles: Muscle[];
  equip: Equip[];
  diff: number; // 1 to 5
  mode: 'reps' | 'hold';
  chain: 'Open' | 'Closed';
  zone?: 'upper' | 'lower';
  anatomy: string;
  cues: string[];
  mistakes: string[];
  regression: string;
  progression: string;
}

export type DayType = 'Rest' | 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'Full Body';

export interface PlannedExercise {
  id: string;
  sets: 2 | 3;
  target: string;
  workSec: number;
  restSec: number;
}

export interface DayPlan {
  day: string;
  type: DayType;
  exercises: PlannedExercise[];
  note?: string;
}

export interface WorkoutSchedule {
  sig: string;
  days: DayPlan[];
}

export type Slot = 'protein' | 'carb' | 'fat' | 'produce';
export type MealName = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealItem {
  foodId: string;
  grams: number;
  slot: Slot;
}

export interface Meal {
  name: MealName;
  items: MealItem[];
  rot: number;
}

export interface MealPlan {
  sig: string;
  days: Meal[][];
}

export interface CompletedSession {
  id: string;
  date: string;
  day: string;
  type: DayType;
  exercises: number;
  minutes: number;
}

export interface BenchLog {
  date: string;
  values: Benchmarks;
}

export interface Macros {
  p: number;
  c: number;
  f: number;
  kcal: number;
}
