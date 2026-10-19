import { useDeferredValue, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Badge, Card, Difficulty } from '../components/ui';
import { EQUIP_LABEL, EXERCISES, MUSCLE_LABEL } from '../data/exercises';
import type { Category, Exercise, Muscle, Profile } from '../types';

const CATS: { v: Category | 'all'; l: string }[] = [
  { v: 'all', l: 'All' }, { v: 'push', l: 'Push' }, { v: 'pull', l: 'Pull' }, { v: 'legs', l: 'Legs' }, { v: 'core', l: 'Core' },
];
const MUSCLES = Object.keys(MUSCLE_LABEL) as Muscle[];
const CORE_QUERY = /^(abs?|core|abdominals?|six ?pack)$/i;

/** Strict abs rule: only dedicated core movements, never push-ups or pull-ups that merely brace the trunk. */
const isAbs = (e: Exercise) => e.cat === 'core' && e.muscles.includes('abs');

export default function LibraryView({ profile }: { profile: Profile }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [muscle, setMuscle] = useState<Muscle | 'all'>('all');
  const [diff, setDiff] = useState(0);
  const [mine, setMine] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const dq = useDeferredValue(q.trim());

  const list = useMemo(() => {
    const coreSearch = CORE_QUERY.test(dq);
    return EXERCISES.filter((e) => {
      if (cat !== 'all' && e.cat !== cat) return false;
      if (muscle === 'abs' ? !isAbs(e) : muscle !== 'all' && !e.muscles.includes(muscle)) return false;
      if (diff && e.diff !== diff) return false;
      if (mine && !e.equip.every((x) => profile.equipment.includes(x))) return false;
      if (coreSearch) return /^core$/i.test(dq) ? e.cat === 'core' : isAbs(e);
      if (dq) {
        const hay = `${e.name} ${e.muscles.map((m) => MUSCLE_LABEL[m]).join(' ')} ${e.cat}`.toLowerCase();
        return dq.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
      }
      return true;
    });
  }, [dq, cat, muscle, diff, mine, profile.equipment]);

  const sel = 'bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-400';

  return (
    <div className="space-y-4">
      <Card className="p-3.5 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${EXERCISES.length} exercises (try "abs", "lats", "pistol")`}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            {CATS.map((c) => (
              <button key={c.v} onClick={() => setCat(c.v)} className={`px-3 py-1.5 rounded-lg text-sm border ${cat === c.v ? 'border-amber-400 bg-amber-400/10 text-amber-200' : 'border-neutral-700 text-neutral-300'}`}>{c.l}</button>
            ))}
          </div>
          <select className={sel} value={muscle} onChange={(e) => setMuscle(e.target.value as Muscle | 'all')} aria-label="Muscle group">
            <option value="all">All muscles</option>
            {MUSCLES.map((m) => <option key={m} value={m}>{MUSCLE_LABEL[m]}</option>)}
          </select>
          <select className={sel} value={diff} onChange={(e) => setDiff(Number(e.target.value))} aria-label="Difficulty">
            <option value={0}>Any difficulty</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Level {n}</option>)}
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="accent-amber-400 w-4 h-4" /> My equipment only
          </label>
          <span className="ml-auto text-sm text-neutral-400">{list.length} shown</span>
        </div>
        {(muscle === 'abs' || CORE_QUERY.test(dq)) && <p className="text-xs text-sky-300">Strict Abs filter: showing dedicated core movements only.</p>}
      </Card>

      <div className="grid md:grid-cols-2 gap-2.5">
        {list.map((e) => {
          const expanded = open === e.id;
          return (
            <Card key={e.id} className="p-4">
              <button onClick={() => setOpen(expanded ? null : e.id)} className="w-full text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white flex-1">{e.name}</h3>
                  <Difficulty n={e.diff} />
                  <ChevronDown size={16} className={`text-neutral-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge tone={e.cat === 'core' ? 'sky' : 'amber'}>{e.cat}</Badge>
                  {e.muscles.map((m) => <Badge key={m}>{MUSCLE_LABEL[m]}</Badge>)}
                  <Badge>{e.equip.length ? e.equip.map((x) => EQUIP_LABEL[x]).join(' + ') : 'No equipment'}</Badge>
                </div>
              </button>
              {expanded && (
                <div className="mt-3 pt-3 border-t border-neutral-800 text-sm space-y-2.5">
                  <p className="text-neutral-300">{e.anatomy}</p>
                  <p className="text-xs text-neutral-400"><span className="text-amber-400">Kinetic chain:</span> {e.chain} chain {e.chain === 'Closed' ? '(hands or feet fixed, multi-joint co-contraction)' : '(distal limb moves freely, more isolation)'} · {e.mode === 'hold' ? 'Isometric hold' : 'Dynamic reps'}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><div className="text-xs uppercase text-amber-400 mb-1">Technique cues</div><ul className="list-disc pl-4 text-neutral-300">{e.cues.map((c) => <li key={c}>{c}</li>)}</ul></div>
                    <div><div className="text-xs uppercase text-red-300 mb-1">Common mistakes</div><ul className="list-disc pl-4 text-neutral-300">{e.mistakes.map((c) => <li key={c}>{c}</li>)}</ul></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-2"><span className="text-neutral-500">Regression</span><div className="text-neutral-200">{e.regression}</div></div>
                    <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-2"><span className="text-neutral-500">Progression</span><div className="text-neutral-200">{e.progression}</div></div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {list.length === 0 && <p className="text-center text-neutral-500 py-10">No exercises match those filters.</p>}
    </div>
  );
}
