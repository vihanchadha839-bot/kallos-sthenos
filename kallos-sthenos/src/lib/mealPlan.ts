import { FOOD_BY_ID, MEAL_POOLS, PRODUCE_GRAMS, foodAllowed } from '../data/foods';
import type { Macros, Meal, MealItem, MealName, MealPlan, Profile, Slot } from '../types';
import type { Targets } from './nutrition';

export const MEAL_NAMES: MealName[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const SHARE: Record<MealName, number> = { Breakfast: 0.25, Lunch: 0.3, Dinner: 0.3, Snack: 0.15 };
const BOUNDS: Record<Slot, [number, number]> = { protein: [15, 450], carb: [15, 500], fat: [3, 60], produce: [0, 400] };
const SLOTS: Slot[] = ['protein', 'carb', 'fat', 'produce'];

export function itemMacros(it: MealItem): Macros {
  const f = FOOD_BY_ID[it.foodId];
  const k = it.grams / 100;
  const p = f.p * k, c = f.c * k, fat = f.f * k;
  return { p, c, f: fat, kcal: p * 4 + c * 4 + fat * 9 };
}

export function sumMacros(items: MealItem[]): Macros {
  return items.reduce<Macros>((s, it) => {
    const m = itemMacros(it);
    return { p: s.p + m.p, c: s.c + m.c, f: s.f + m.f, kcal: s.kcal + m.kcal };
  }, { p: 0, c: 0, f: 0, kcal: 0 });
}

export const dayMacros = (meals: Meal[]) => sumMacros(meals.flatMap((m) => m.items));

export function allowedPool(meal: MealName, slot: Slot, p: Profile): string[] {
  const list = MEAL_POOLS[meal][slot].filter((id) => foodAllowed(FOOD_BY_ID[id], p.diet, p.allergens));
  if (list.length) return list;
  // fallback: any allowed food from that slot in any meal
  const any = MEAL_NAMES.flatMap((m) => MEAL_POOLS[m][slot]).filter((id) => foodAllowed(FOOD_BY_ID[id], p.diet, p.allergens));
  return [...new Set(any)];
}

/** Weighted least squares fit of the variable item grams to macro targets (coordinate descent, bounded). */
function fitMeal(items: MealItem[], t: { p: number; c: number; f: number }) {
  const vars = items.filter((it) => it.slot !== 'produce');
  const W = { p: 6, c: 1, f: 2, k: 0.08 };
  const residual = () => {
    const m = sumMacros(items);
    return { p: m.p - t.p, c: m.c - t.c, f: m.f - t.f, k: m.kcal - (t.p * 4 + t.c * 4 + t.f * 9) };
  };
  for (let iter = 0; iter < 80; iter++) {
    for (const v of vars) {
      const fd = FOOD_BY_ID[v.foodId];
      const a = { p: fd.p / 100, c: fd.c / 100, f: fd.f / 100, k: (fd.p * 4 + fd.c * 4 + fd.f * 9) / 100 };
      const r = residual();
      const num = W.p * a.p * r.p + W.c * a.c * r.c + W.f * a.f * r.f + W.k * a.k * r.k;
      const den = W.p * a.p ** 2 + W.c * a.c ** 2 + W.f * a.f ** 2 + W.k * a.k ** 2;
      if (den <= 0) continue;
      const [lo, hi] = BOUNDS[v.slot];
      v.grams = Math.min(hi, Math.max(lo, v.grams - num / den));
    }
  }
  vars.forEach((v) => (v.grams = Math.round(v.grams)));
}

/** Fine-tune whole-gram quantities across the day so calories and protein land on target. */
function polishDay(meals: Meal[], tg: Targets) {
  const vars = meals.flatMap((m) => m.items.filter((i) => i.slot !== 'produce'));
  const err = () => {
    const d = dayMacros(meals);
    return (d.kcal - tg.kcal) ** 2 + 30 * (d.p - tg.protein) ** 2 + 1 * (d.f - tg.fat) ** 2;
  };
  let best = err();
  for (let iter = 0; iter < 800 && best > 0.3; iter++) {
    let move: { v: MealItem; d: number } | null = null;
    for (const v of vars) {
      for (const d of [-10, -3, -1, 1, 3, 10]) {
        const g = v.grams + d;
        const [lo, hi] = BOUNDS[v.slot];
        if (g < lo || g > hi) continue;
        v.grams = g;
        const e = err();
        v.grams -= d;
        if (e < best - 1e-9) { best = e; move = { v, d }; }
      }
    }
    if (!move) break;
    move.v.grams += move.d;
  }
}

export function buildMeal(name: MealName, rot: number, p: Profile, override?: Partial<Record<Slot, string>>): Meal {
  const items: MealItem[] = SLOTS.map((slot) => {
    const pool = allowedPool(name, slot, p);
    const foodId = override?.[slot] ?? pool[rot % Math.max(1, pool.length)];
    const grams = slot === 'produce' ? PRODUCE_GRAMS[name] : slot === 'fat' ? 10 : 100;
    return { foodId, grams, slot };
  }).filter((it) => !!it.foodId);
  return { name, items, rot };
}

export function balanceDay(meals: Meal[], tg: Targets): Meal[] {
  const copy = meals.map((m) => ({ ...m, items: m.items.map((i) => ({ ...i })) }));
  copy.forEach((m) => {
    const s = SHARE[m.name];
    fitMeal(m.items, { p: tg.protein * s, c: tg.carbs * s, f: tg.fat * s });
  });
  polishDay(copy, tg);
  return copy;
}

export function mealSignature(p: Profile, tg: Targets): string {
  return JSON.stringify([tg.kcal, tg.protein, tg.fat, p.diet, [...p.allergens].sort()]);
}

export function generateMealPlan(p: Profile, tg: Targets): MealPlan {
  const days = Array.from({ length: 7 }, (_, d) => {
    const meals = MEAL_NAMES.map((name, mi) => buildMeal(name, d + mi * 2, p));
    return balanceDay(meals, tg);
  });
  return { sig: mealSignature(p, tg), days };
}

export function swapItemInDay(day: Meal[], mealIdx: number, slot: Slot, foodId: string, tg: Targets): Meal[] {
  const meals = day.map((m, i) => (i !== mealIdx ? m : { ...m, items: m.items.map((it) => (it.slot === slot ? { ...it, foodId, grams: slot === 'produce' ? it.grams : 100 } : it)) }));
  return balanceDay(meals, tg);
}

export function swapWholeMeal(day: Meal[], mealIdx: number, p: Profile, tg: Targets): Meal[] {
  const cur = day[mealIdx];
  let rot = cur.rot + 1;
  let next = buildMeal(cur.name, rot, p);
  const same = (a: Meal, b: Meal) => a.items.every((it, i) => b.items[i]?.foodId === it.foodId);
  for (let tries = 0; tries < 6 && same(next, cur); tries++) next = buildMeal(cur.name, ++rot, p);
  const meals = day.map((m, i) => (i === mealIdx ? next : m));
  return balanceDay(meals, tg);
}
