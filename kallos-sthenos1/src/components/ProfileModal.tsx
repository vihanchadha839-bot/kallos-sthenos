import { useEffect, useState, type ReactNode } from 'react';
import { Check, UserCog } from 'lucide-react';
import Modal from './Modal';
import { Btn } from './ui';
import type { Allergen, Benchmarks, Diet, Equip, Goal, Profile } from '../types';
import { cmToFtIn, ftInToCm, kgToLb, lbToKg, round1 } from '../lib/units';
import { EQUIP_LABEL } from '../data/exercises';

export const DEFAULT_PROFILE: Profile = {
  units: 'metric', age: 25, sex: 'male', heightCm: 175, weightKg: 72, activity: 1.55, goal: 'maintain',
  benchmarks: { pushups: 20, pullups: 5, dips: 8, plank: 60, lsit: 5, hlr: 5, handstand: 15, slsquat: 2 },
  days: 4, duration: 60, equipment: ['pullbar', 'wall'], diet: 'standard', allergens: [],
};

const ACTIVITY = [
  { v: 1.2, l: 'Sedentary', d: 'Desk job, little exercise' },
  { v: 1.375, l: 'Lightly Active', d: '1 to 3 sessions a week' },
  { v: 1.55, l: 'Moderately Active', d: '3 to 5 sessions a week' },
  { v: 1.725, l: 'Very Active', d: '6 to 7 sessions a week' },
  { v: 1.9, l: 'Extra Active', d: 'Physical job + training' },
];
const GOALS: { v: Goal; l: string; d: string }[] = [
  { v: 'cut', l: 'Cutting', d: 'Safe 15% deficit' },
  { v: 'bulk', l: 'Bulking', d: '+12% surplus' },
  { v: 'maintain', l: 'Maintaining', d: 'TDEE equilibrium' },
  { v: 'recovery', l: 'Recovery / Rehab', d: 'Maintenance, tissue repair' },
];
const BENCH: { k: keyof Benchmarks; l: string; u: string }[] = [
  { k: 'pushups', l: 'Max push-ups', u: 'reps' },
  { k: 'pullups', l: 'Max pull-ups', u: 'reps' },
  { k: 'dips', l: 'Max dips', u: 'reps' },
  { k: 'plank', l: 'Plank hold', u: 'sec' },
  { k: 'lsit', l: 'L-sit hold', u: 'sec' },
  { k: 'hlr', l: 'Hanging leg raises', u: 'reps' },
  { k: 'handstand', l: 'Wall handstand', u: 'sec' },
  { k: 'slsquat', l: 'Single-leg squats', u: 'reps' },
];
const DURATIONS = [15, 20, 30, 45, 60, 75, 90, 105, 120];
const DIETS: Diet[] = ['standard', 'vegetarian', 'vegan', 'pescatarian'];
const ALLERGENS: Allergen[] = ['dairy', 'gluten', 'nuts', 'peanuts', 'eggs', 'fish', 'shellfish', 'soy'];
const EQUIPS: Equip[] = ['pullbar', 'dipbars', 'rings', 'bands', 'bench', 'wall'];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5">{title}</h3>
      {children}
    </section>
  );
}

const inputCls = 'w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white tabular-nums focus:outline-none focus:border-amber-400';

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm border text-left transition-colors ${active ? 'border-amber-400/60 bg-amber-400/10 text-amber-200' : 'border-neutral-700 bg-neutral-950 text-neutral-300 hover:border-neutral-500'}`}>
      {children}
    </button>
  );
}

export default function ProfileModal({ open, profile, onSave, onClose }: {
  open: boolean; profile: Profile; onSave: (p: Profile) => void; onClose: () => void;
}) {
  const [d, setD] = useState<Profile>(profile);
  const [hCm, setHCm] = useState('');
  const [hFt, setHFt] = useState('');
  const [hIn, setHIn] = useState('');
  const [w, setW] = useState('');

  const syncFields = (p: Profile) => {
    setHCm(String(round1(p.heightCm)));
    const { ft, inch } = cmToFtIn(p.heightCm);
    setHFt(String(ft));
    setHIn(String(inch));
    setW(String(round1(p.units === 'metric' ? p.weightKg : kgToLb(p.weightKg))));
  };

  useEffect(() => {
    if (open) { setD(profile); syncFields(profile); }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setD((p) => ({ ...p, [k]: v }));
  const num = (s: string) => (s === '' || isNaN(Number(s)) ? 0 : Number(s));

  const toggleUnits = (u: Profile['units']) => {
    if (u === d.units) return;
    const next = { ...d, units: u };
    setD(next);
    syncFields(next);
  };

  const onHeightCm = (s: string) => { setHCm(s); set('heightCm', num(s)); };
  const onHeightImp = (ft: string, inch: string) => { setHFt(ft); setHIn(inch); set('heightCm', ftInToCm(num(ft), num(inch))); };
  const onWeight = (s: string) => { setW(s); set('weightKg', d.units === 'metric' ? num(s) : lbToKg(num(s))); };

  const valid = d.age >= 10 && d.age <= 100 && d.heightCm >= 120 && d.heightCm <= 230 && d.weightKg >= 30 && d.weightKg <= 250;
  const youth = d.age > 0 && d.age < 18;

  const toggleList = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <Modal open={open} onClose={onClose} wide title="Customize Profile" icon={<UserCog className="text-amber-400" size={22} />}
      footer={
        <div className="flex items-center gap-3">
          <p className="text-xs text-neutral-400 flex-1">{valid ? 'Your plan regenerates on save.' : 'Check age (10 to 100), height (120 to 230 cm) and weight (30 to 250 kg).'}</p>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" disabled={!valid} onClick={() => onSave({ ...d, heightCm: round1(d.heightCm), weightKg: round1(d.weightKg) })}><Check size={16} /> Save & Generate</Btn>
        </div>
      }>
      <Section title="Units">
        <div className="inline-flex bg-neutral-950 border border-neutral-700 rounded-xl p-1">
          {(['metric', 'imperial'] as const).map((u) => (
            <button key={u} type="button" onClick={() => toggleUnits(u)}
              className={`px-4 py-1.5 rounded-lg text-sm ${d.units === u ? 'bg-amber-400 text-neutral-950 font-semibold' : 'text-neutral-300'}`}>
              {u === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, ft/in)'}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Biometrics">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="text-sm text-neutral-300">Age
            <input type="number" inputMode="numeric" className={`${inputCls} mt-1`} value={d.age || ''} onChange={(e) => set('age', num(e.target.value))} />
          </label>
          <div className="text-sm text-neutral-300">Sex
            <div className="grid grid-cols-2 gap-1 mt-1">
              {(['male', 'female'] as const).map((s) => (
                <Chip key={s} active={d.sex === s} onClick={() => set('sex', s)}>{cap(s)}</Chip>
              ))}
            </div>
          </div>
          {d.units === 'metric' ? (
            <label className="text-sm text-neutral-300">Height (cm)
              <input type="number" inputMode="decimal" className={`${inputCls} mt-1`} value={hCm} onChange={(e) => onHeightCm(e.target.value)} />
            </label>
          ) : (
            <div className="text-sm text-neutral-300">Height (ft / in)
              <div className="grid grid-cols-2 gap-1 mt-1">
                <input type="number" inputMode="numeric" aria-label="feet" className={inputCls} value={hFt} onChange={(e) => onHeightImp(e.target.value, hIn)} />
                <input type="number" inputMode="decimal" aria-label="inches" className={inputCls} value={hIn} onChange={(e) => onHeightImp(hFt, e.target.value)} />
              </div>
            </div>
          )}
          <label className="text-sm text-neutral-300">Weight ({d.units === 'metric' ? 'kg' : 'lb'})
            <input type="number" inputMode="decimal" className={`${inputCls} mt-1`} value={w} onChange={(e) => onWeight(e.target.value)} />
          </label>
        </div>
        <p className="text-xs text-neutral-500 mt-2 tabular-nums">
          = {round1(d.heightCm)} cm / {cmToFtIn(d.heightCm).ft}′{cmToFtIn(d.heightCm).inch}″ · {round1(d.weightKg)} kg / {round1(kgToLb(d.weightKg))} lb
        </p>
      </Section>

      <Section title="Daily Activity Level">
        <div className="grid sm:grid-cols-2 gap-2">
          {ACTIVITY.map((a) => (
            <Chip key={a.v} active={d.activity === a.v} onClick={() => set('activity', a.v)}>
              <span className="font-medium">{a.l}</span> <span className="text-neutral-500">×{a.v}</span>
              <span className="block text-xs text-neutral-400">{a.d}</span>
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Primary Fitness Goal">
        {youth && <div className="mb-2 text-sm rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-200 px-3 py-2">Youth Mode active: under 18s are locked to healthy maintenance with no caloric deficit.</div>}
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => (
            <Chip key={g.v} active={(youth ? 'maintain' : d.goal) === g.v} onClick={() => !youth && set('goal', g.v)}>
              <span className="font-medium">{g.l}</span>
              <span className="block text-xs text-neutral-400">{g.d}</span>
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Baseline Ability Benchmarks">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BENCH.map((b) => (
            <label key={b.k} className="text-sm text-neutral-300">{b.l} <span className="text-neutral-500">({b.u})</span>
              <input type="number" min={0} inputMode="numeric" className={`${inputCls} mt-1`} value={d.benchmarks[b.k]}
                onChange={(e) => set('benchmarks', { ...d.benchmarks, [b.k]: Math.max(0, num(e.target.value)) })} />
            </label>
          ))}
        </div>
      </Section>

      <Section title="Training Schedule">
        <div className="text-sm text-neutral-300 mb-1.5">Days per week</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button key={n} type="button" onClick={() => set('days', n)}
              className={`w-10 h-10 rounded-lg border text-sm font-semibold ${d.days === n ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700 bg-neutral-950 text-neutral-300'}`}>{n}</button>
          ))}
        </div>
        <div className="text-sm text-neutral-300 mb-1.5">Session duration (minutes)</div>
        <div className="flex flex-wrap gap-1.5">
          {DURATIONS.map((n) => (
            <button key={n} type="button" onClick={() => set('duration', n)}
              className={`px-3 h-10 rounded-lg border text-sm font-semibold ${d.duration === n ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700 bg-neutral-950 text-neutral-300'}`}>{n}</button>
          ))}
        </div>
      </Section>

      <Section title="Equipment">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Chip active onClick={() => {}}>Floor / None <span className="block text-xs text-neutral-400">Always included</span></Chip>
          {EQUIPS.map((q) => (
            <Chip key={q} active={d.equipment.includes(q)} onClick={() => set('equipment', toggleList(d.equipment, q))}>{EQUIP_LABEL[q]}</Chip>
          ))}
        </div>
      </Section>

      <Section title="Diet & Allergies">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {DIETS.map((x) => <Chip key={x} active={d.diet === x} onClick={() => set('diet', x)}>{cap(x)}</Chip>)}
        </div>
        <div className="text-sm text-neutral-300 mb-1.5">Exclude allergens</div>
        <div className="flex flex-wrap gap-1.5">
          {ALLERGENS.map((a) => (
            <button key={a} type="button" onClick={() => set('allergens', toggleList(d.allergens, a))}
              className={`px-3 py-1.5 rounded-full text-sm border ${d.allergens.includes(a) ? 'border-red-400/50 bg-red-400/10 text-red-200 line-through' : 'border-neutral-700 bg-neutral-950 text-neutral-300'}`}>{cap(a)}</button>
          ))}
        </div>
      </Section>
    </Modal>
  );
}
