import { useState, type Dispatch, type SetStateAction } from 'react';
import { Award, CalendarCheck, Plus, Trash2, TrendingUp } from 'lucide-react';
import { Badge, Btn, Card, Stat } from '../components/ui';
import { LEVELS, levelInfo } from '../lib/level';
import type { BenchLog, Benchmarks, CompletedSession, Profile } from '../types';

interface Props {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  sessions: CompletedSession[];
  setSessions: Dispatch<SetStateAction<CompletedSession[]>>;
  benchLog: BenchLog[];
  setBenchLog: Dispatch<SetStateAction<BenchLog[]>>;
}

const METRICS: { k: keyof Benchmarks; l: string; u: string }[] = [
  { k: 'pushups', l: 'Push-ups', u: '' }, { k: 'pullups', l: 'Pull-ups', u: '' }, { k: 'dips', l: 'Dips', u: '' },
  { k: 'plank', l: 'Plank', u: 's' }, { k: 'lsit', l: 'L-sit', u: 's' }, { k: 'hlr', l: 'Hanging leg raises', u: '' },
  { k: 'handstand', l: 'Wall handstand', u: 's' }, { k: 'slsquat', l: 'Single-leg squats', u: '' },
];

function Spark({ values }: { values: number[] }) {
  if (values.length < 2) return <div className="h-8 text-xs text-neutral-600 flex items-end">Log twice to see a trend</div>;
  const max = Math.max(...values, 1), min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${30 - ((v - min) / span) * 26 - 2}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-8">
      <polyline points={pts} fill="none" stroke="#fbbf24" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

function streakWeeks(sessions: CompletedSession[]): number {
  const weekOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x.getTime(); };
  const weeks = new Set(sessions.map((s) => weekOf(new Date(s.date))));
  let w = weekOf(new Date()), n = 0;
  if (!weeks.has(w)) w -= 7 * 864e5;
  while (weeks.has(w)) { n++; w -= 7 * 864e5; }
  return n;
}

export default function ProgressView({ profile, setProfile, sessions, setSessions, benchLog, setBenchLog }: Props) {
  const [form, setForm] = useState<Benchmarks>(profile.benchmarks);
  const [confirmClear, setConfirmClear] = useState(false);
  const lvl = levelInfo(profile.benchmarks);
  const history = benchLog.length ? benchLog : [{ date: new Date().toISOString(), values: profile.benchmarks }];
  const first = history[0].values;

  const logIt = () => {
    setBenchLog((l) => [...l, { date: new Date().toISOString(), values: form }]);
    setProfile((p) => ({ ...p, benchmarks: form }));
  };

  const week = sessions.filter((s) => Date.now() - new Date(s.date).getTime() < 7 * 864e5);
  const totalMin = sessions.reduce((s, x) => s + x.minutes, 0);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/40 grid place-items-center"><Award className="text-amber-400" size={30} /></div>
          <div className="flex-1 min-w-[180px]">
            <div className="text-xs uppercase tracking-wider text-neutral-400">Current Level</div>
            <div className="text-2xl font-bold text-white">{lvl.name} <span className="text-amber-400 text-lg tabular-nums">· {lvl.score}/100</span></div>
            <div className="mt-2 h-2 rounded-full bg-neutral-800 overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${Math.min(100, lvl.progress * 100)}%` }} /></div>
            <div className="text-xs text-neutral-400 mt-1">{lvl.next ? `${lvl.nextMin! - lvl.score} points to ${lvl.next}` : 'Top level reached'}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {LEVELS.map((l, i) => <Badge key={l.name} tone={i <= lvl.idx ? 'amber' : 'neutral'}>{l.name} {l.min}+</Badge>)}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <Stat label="Total sessions" value={sessions.length} tone="emerald" />
        <Stat label="Last 7 days" value={week.length} sub={`target ${profile.days}`} />
        <Stat label="Weekly streak" value={`${streakWeeks(sessions)} wk`} />
        <Stat label="Time trained" value={`${Math.round(totalMin / 60 * 10) / 10} h`} />
      </div>

      <Card className="p-4 sm:p-5">
        <h3 className="flex items-center gap-2 font-semibold text-white mb-3"><TrendingUp size={17} className="text-amber-400" /> Ability Benchmarks</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {METRICS.map((m) => {
            const vals = history.map((h) => h.values[m.k] ?? 0);
            const cur = profile.benchmarks[m.k];
            const delta = cur - (first[m.k] ?? 0);
            return (
              <div key={m.k} className="rounded-xl bg-neutral-950 border border-neutral-800 p-3">
                <div className="text-xs text-neutral-400">{m.l}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white tabular-nums">{cur}{m.u}</span>
                  {delta !== 0 && <span className={`text-xs tabular-nums ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{delta > 0 ? '+' : ''}{delta}{m.u}</span>}
                </div>
                <Spark values={vals} />
                <input type="number" min={0} aria-label={`New ${m.l}`} value={form[m.k]} onChange={(e) => setForm({ ...form, [m.k]: Math.max(0, Number(e.target.value) || 0) })}
                  className="mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1.5 text-sm text-white tabular-nums focus:outline-none focus:border-amber-400" />
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Btn variant="primary" onClick={logIt}><Plus size={16} /> Log Benchmarks</Btn>
          <span className="text-xs text-neutral-400">{benchLog.length} entries. Logging updates your level, skills and workout difficulty.</span>
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <CalendarCheck size={17} className="text-emerald-400" />
          <h3 className="font-semibold text-white flex-1">Completed Sessions</h3>
          {sessions.length > 0 && (confirmClear
            ? <><Btn variant="danger" onClick={() => { setSessions([]); setConfirmClear(false); }}>Confirm clear</Btn><Btn onClick={() => setConfirmClear(false)}>Cancel</Btn></>
            : <Btn variant="danger" onClick={() => setConfirmClear(true)}><Trash2 size={14} /> Clear</Btn>)}
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-neutral-500">No sessions yet. Hit "Complete Session" on the Workout Plan tab after training.</p>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {[...sessions].reverse().slice(0, 30).map((s) => (
              <li key={s.id} className="py-2.5 flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white font-medium w-24">{s.type}</span>
                <span className="text-neutral-400 flex-1">{fmtDate(s.date)} · {s.day}</span>
                <span className="text-neutral-400 tabular-nums">{s.exercises} ex · {s.minutes} min</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
