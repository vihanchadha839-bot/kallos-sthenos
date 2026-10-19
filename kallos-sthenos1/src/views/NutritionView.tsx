import { useState, type Dispatch, type SetStateAction } from 'react';
import { ArrowLeftRight, ArrowRight, Check, Flame, RefreshCw, Shuffle } from 'lucide-react';
import Modal from '../components/Modal';
import { Badge, Btn, Card, Stat } from '../components/ui';
import { FOOD_BY_ID } from '../data/foods';
import { allowedPool, dayMacros, generateMealPlan, itemMacros, sumMacros, swapItemInDay, swapWholeMeal } from '../lib/mealPlan';
import type { Targets } from '../lib/nutrition';
import Photo from '../components/Photo';
import { MEAL_IMG } from '../data/images';
import type { Macros, Meal, MealPlan, Profile, Slot } from '../types';

interface Props {
  profile: Profile;
  targets: Targets;
  plan: MealPlan;
  setPlan: Dispatch<SetStateAction<MealPlan>>;
}

const r0 = Math.round;
const SLOT_LABEL: Record<Slot, string> = { protein: 'Protein', carb: 'Carb', fat: 'Fat', produce: 'Produce' };
const DAY_LABEL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MacroLine({ m, className = '' }: { m: Macros; className?: string }) {
  return (
    <span className={`tabular-nums ${className}`}>
      <span className="text-white font-semibold">{r0(m.kcal)}</span> kcal · P {r0(m.p)}g · C {r0(m.c)}g · F {r0(m.f)}g
    </span>
  );
}

type SwapState =
  | { kind: 'item'; mealIdx: number; slot: Slot; pick?: string; preview?: Meal[] }
  | { kind: 'meal'; mealIdx: number; preview: Meal[] };

export default function NutritionView({ profile, targets: t, plan, setPlan }: Props) {
  const [dayIdx, setDayIdx] = useState(() => (new Date().getDay() + 6) % 7);
  const [swap, setSwap] = useState<SwapState | null>(null);

  const day = plan.days[dayIdx];
  const totals = dayMacros(day);
  const pPct = (t.protein * 4) / t.kcal, cPct = (t.carbs * 4) / t.kcal, fPct = (t.fat * 9) / t.kcal;

  const commit = (preview: Meal[]) => {
    setPlan((p) => ({ ...p, days: p.days.map((d, i) => (i === dayIdx ? preview : d)) }));
    setSwap(null);
  };

  const pickReplacement = (foodId: string) => {
    if (!swap || swap.kind !== 'item') return;
    setSwap({ ...swap, pick: foodId, preview: swapItemInDay(day, swap.mealIdx, swap.slot, foodId, t) });
  };

  const goalLabel = { cut: 'Cutting', bulk: 'Bulking', maintain: 'Maintaining', recovery: 'Recovery / Rehab' }[t.effectiveGoal];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <Stat label="BMR" value={t.bmr} sub="Mifflin-St Jeor" />
        <Stat label="TDEE" value={t.tdee} sub={`BMR × ${profile.activity}`} />
        <Stat label="Daily Target" value={t.kcal} sub={goalLabel} tone="emerald" />
        <Stat label="Protein" value={`${t.protein}g`} sub={`1.9 g/kg × ${profile.weightKg} kg`} tone="amber" />
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Flame size={18} className="text-emerald-400" />
          <h2 className="font-semibold text-white flex-1">Macro Breakdown</h2>
          {t.youth && <Badge tone="sky">Youth Mode</Badge>}
        </div>
        <div className="h-3 rounded-full overflow-hidden flex bg-neutral-800">
          <div className="bg-amber-400" style={{ width: `${pPct * 100}%` }} />
          <div className="bg-emerald-400" style={{ width: `${cPct * 100}%` }} />
          <div className="bg-sky-400" style={{ width: `${fPct * 100}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
          <div><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5" />Protein <b className="text-white">{t.protein}g</b> <span className="text-neutral-500">{r0(pPct * 100)}%</span></div>
          <div><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />Carbs <b className="text-white">{t.carbs}g</b> <span className="text-neutral-500">{r0(cPct * 100)}%</span></div>
          <div><span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-1.5" />Fat <b className="text-white">{t.fat}g</b> <span className="text-neutral-500">{r0(fPct * 100)}%</span></div>
        </div>
        <p className="mt-3 text-xs text-neutral-400 tabular-nums">
          Atwater check: ({t.protein} × 4) + ({t.carbs} × 4) + ({t.fat} × 9) = <span className="text-emerald-400 font-semibold">{t.kcal} kcal</span>. {t.note}
        </p>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1">
          {DAY_LABEL.map((d, i) => (
            <button key={d} onClick={() => setDayIdx(i)}
              className={`px-3.5 py-2 rounded-xl text-sm border shrink-0 ${dayIdx === i ? 'border-emerald-400 bg-emerald-400/10 text-emerald-200' : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'}`}>
              Day {i + 1} <span className="text-xs opacity-70">{d}</span>
            </button>
          ))}
        </div>
        <Btn onClick={() => setPlan(generateMealPlan(profile, t))}><RefreshCw size={15} /> Regenerate week</Btn>
      </div>

      <Card className="p-3.5 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-neutral-400">Day {dayIdx + 1} total:</span>
        <MacroLine m={totals} className="text-neutral-300" />
        <span className="ml-auto">
          {Math.abs(totals.kcal - t.kcal) <= 3 && Math.abs(totals.p - t.protein) <= 1.5
            ? <Badge tone="emerald"><Check size={12} /> On target</Badge>
            : <Badge tone="amber">Δ {r0(totals.kcal - t.kcal)} kcal · {r0(totals.p - t.protein)}g P</Badge>}
        </span>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        {day.map((meal, mi) => {
          const mm = sumMacros(meal.items);
          return (
            <Card key={meal.name} className="overflow-hidden">
              <Photo id={MEAL_IMG[meal.name]} alt="" sizes="(min-width: 768px) 560px, 100vw" className="h-24 sm:h-28" />
              <div className="p-4 pt-0 -mt-8 relative">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white text-lg flex-1">{meal.name}</h3>
                <button onClick={() => setSwap({ kind: 'meal', mealIdx: mi, preview: swapWholeMeal(day, mi, profile, t) })}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:border-emerald-400/50">
                  <Shuffle size={13} /> Swap meal
                </button>
              </div>
              <div className="text-xs text-neutral-400 mb-3"><MacroLine m={mm} /></div>
              <ul className="divide-y divide-neutral-800">
                {meal.items.map((it) => {
                  const f = FOOD_BY_ID[it.foodId];
                  const m = itemMacros(it);
                  return (
                    <li key={it.slot} className="flex items-center gap-3 py-2">
                      <span className="w-14 shrink-0 text-right tabular-nums text-emerald-300 font-semibold text-sm">{it.grams}g</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{f.name}</div>
                        <div className="text-xs text-neutral-500 tabular-nums">{r0(m.kcal)} kcal · P {r0(m.p)} · C {r0(m.c)} · F {r0(m.f)}</div>
                      </div>
                      <button onClick={() => setSwap({ kind: 'item', mealIdx: mi, slot: it.slot })} aria-label={`Swap ${f.name}`}
                        className="p-2 rounded-lg text-neutral-400 hover:text-emerald-300 hover:bg-neutral-800"><ArrowLeftRight size={15} /></button>
                    </li>
                  );
                })}
              </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Swap modals */}
      <Modal open={!!swap} onClose={() => setSwap(null)} title={swap?.kind === 'meal' ? 'Confirm Meal Swap' : swap?.pick ? 'Confirm Replacement' : 'Choose a Replacement'}
        icon={<ArrowLeftRight className="text-emerald-400" size={20} />}
        footer={swap && (swap.kind === 'meal' || swap.preview) ? (
          <div className="flex justify-end gap-2">
            <Btn onClick={() => (swap.kind === 'item' ? setSwap({ ...swap, pick: undefined, preview: undefined }) : setSwap(null))}>{swap.kind === 'item' ? 'Back' : 'Cancel'}</Btn>
            <Btn variant="emerald" onClick={() => commit(swap.preview!)}><Check size={16} /> Confirm Replacement</Btn>
          </div>
        ) : undefined}>
        {swap?.kind === 'item' && !swap.pick && (() => {
          const cur = day[swap.mealIdx].items.find((i) => i.slot === swap.slot)!;
          const opts = allowedPool(day[swap.mealIdx].name, swap.slot, profile).filter((id) => id !== cur.foodId);
          return (
            <>
              <p className="text-sm text-neutral-400 mb-3">Replace <b className="text-white">{FOOD_BY_ID[cur.foodId].name}</b> ({SLOT_LABEL[swap.slot].toLowerCase()}) in {day[swap.mealIdx].name}. Portions rebalance to keep your targets.</p>
              {opts.length === 0 ? <p className="text-sm text-neutral-400">No other options fit your diet settings.</p> : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {opts.map((id) => {
                    const f = FOOD_BY_ID[id];
                    return (
                      <button key={id} onClick={() => pickReplacement(id)} className="text-left p-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-emerald-400/50">
                        <div className="text-sm text-white">{f.name}</div>
                        <div className="text-xs text-neutral-500 tabular-nums">per 100g: P {f.p} · C {f.c} · F {f.f}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}
        {swap && swap.preview && (swap.kind === 'meal' || swap.pick) && (() => {
          const oldMeal = day[swap.mealIdx];
          const newMeal = swap.preview[swap.mealIdx];
          const oldDay = totals, newDay = dayMacros(swap.preview);
          const oldItem = swap.kind === 'item' ? oldMeal.items.find((i) => i.slot === swap.slot)! : null;
          const newItem = swap.kind === 'item' ? newMeal.items.find((i) => i.slot === swap.slot)! : null;
          return (
            <div className="space-y-4 text-sm">
              {oldItem && newItem && (
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950">
                    <div className="text-xs text-neutral-500 mb-1">Current</div>
                    <div className="text-white">{oldItem.grams}g {FOOD_BY_ID[oldItem.foodId].name}</div>
                    <div className="text-xs text-neutral-400 mt-1"><MacroLine m={itemMacros(oldItem)} /></div>
                  </div>
                  <ArrowRight className="text-emerald-400" size={18} />
                  <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5">
                    <div className="text-xs text-emerald-400 mb-1">New</div>
                    <div className="text-white">{newItem.grams}g {FOOD_BY_ID[newItem.foodId].name}</div>
                    <div className="text-xs text-neutral-400 mt-1"><MacroLine m={itemMacros(newItem)} /></div>
                  </div>
                </div>
              )}
              {swap.kind === 'meal' && (
                <div className="grid sm:grid-cols-2 gap-2">
                  {[oldMeal, newMeal].map((m, k) => (
                    <div key={k} className={`p-3 rounded-xl border ${k ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-neutral-800 bg-neutral-950'}`}>
                      <div className={`text-xs mb-1 ${k ? 'text-emerald-400' : 'text-neutral-500'}`}>{k ? 'New' : 'Current'} {m.name}</div>
                      <ul className="space-y-0.5 text-neutral-300">{m.items.map((i) => <li key={i.slot}>{i.grams}g {FOOD_BY_ID[i.foodId].name}</li>)}</ul>
                    </div>
                  ))}
                </div>
              )}
              <table className="w-full tabular-nums">
                <thead><tr className="text-xs text-neutral-500"><th className="text-left font-normal py-1"></th><th className="text-right font-normal">kcal</th><th className="text-right font-normal">Protein</th><th className="text-right font-normal">Carbs</th><th className="text-right font-normal">Fat</th></tr></thead>
                <tbody className="text-neutral-300">
                  {[
                    ['Meal before', sumMacros(oldMeal.items)], ['Meal after', sumMacros(newMeal.items)],
                    ['Day before', oldDay], ['Day after', newDay],
                  ].map(([l, m]) => {
                    const mm = m as Macros;
                    return (
                      <tr key={l as string} className="border-t border-neutral-800">
                        <td className="py-1.5 text-neutral-400">{l as string}</td>
                        <td className="text-right">{r0(mm.kcal)}</td><td className="text-right">{r0(mm.p)}g</td><td className="text-right">{r0(mm.c)}g</td><td className="text-right">{r0(mm.f)}g</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-neutral-800 text-emerald-400"><td className="py-1.5">Daily target</td><td className="text-right">{t.kcal}</td><td className="text-right">{t.protein}g</td><td className="text-right">{t.carbs}g</td><td className="text-right">{t.fat}g</td></tr>
                </tbody>
              </table>
              <p className="text-xs text-neutral-500">Other items in the day are re-portioned so totals stay on your calorie and protein targets.</p>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
