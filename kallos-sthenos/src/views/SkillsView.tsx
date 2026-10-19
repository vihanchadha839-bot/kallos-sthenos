import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Lock, Target } from 'lucide-react';
import { Badge, Card } from '../components/ui';
import { BENCH_LABEL, SKILLS, type SkillStep } from '../data/skills';
import type { Benchmarks, Profile } from '../types';

const meets = (s: SkillStep, b: Benchmarks) => (Object.entries(s.req) as [keyof Benchmarks, number][]).every(([k, v]) => (b[k] ?? 0) >= v);

function reqText(s: SkillStep) {
  const parts = (Object.entries(s.req) as [keyof Benchmarks, number][])
    .filter(([, v]) => v > 0)
    .map(([k, v]) => (BENCH_LABEL[k].startsWith('s ') ? `${v}${BENCH_LABEL[k]}` : `${v} ${BENCH_LABEL[k]}`));
  if (s.extra) parts.push(s.extra);
  return parts.join(', ');
}

export default function SkillsView({ profile }: { profile: Profile }) {
  const [sel, setSel] = useState(SKILLS[0].id);
  const skill = SKILLS.find((s) => s.id === sel)!;
  const b = profile.benchmarks;

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-4">
      <div className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar">
        {SKILLS.map((s) => {
          const unlocked = s.steps.filter((st) => meets(st, b)).length;
          return (
            <button key={s.id} onClick={() => setSel(s.id)}
              className={`shrink-0 text-left px-3.5 py-2.5 rounded-xl border ${sel === s.id ? 'border-amber-400 bg-amber-400/10' : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-600'}`}>
              <div className="text-sm font-semibold text-white whitespace-nowrap">{s.name}</div>
              <div className="text-xs text-neutral-400 whitespace-nowrap">{unlocked}/{s.steps.length} steps unlocked</div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-white flex-1">{skill.name}</h2>
            <Badge tone="amber">{skill.type}</Badge>
            <Badge>{skill.equipment}</Badge>
          </div>
          <p className="text-neutral-300 text-sm">{skill.summary}</p>
          {skill.warning && (
            <p className="mt-3 flex gap-2 text-sm text-red-200 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" /> {skill.warning}
            </p>
          )}
        </Card>

        <ol className="relative space-y-2.5">
          {skill.steps.map((st, i) => {
            const ok = meets(st, b);
            const current = ok && !skill.steps.slice(i + 1).some((n) => meets(n, b));
            return (
              <li key={st.name}>
                <Card className={`p-4 flex gap-3 ${current ? 'border-amber-400/60' : ok ? 'border-emerald-500/30' : ''}`}>
                  <div className={`w-9 h-9 shrink-0 rounded-full grid place-items-center text-sm font-bold ${ok ? (current ? 'bg-amber-400 text-neutral-950' : 'bg-emerald-500/20 text-emerald-300') : 'bg-neutral-800 text-neutral-500'}`}>
                    {ok ? (current ? i + 1 : <CheckCircle2 size={18} />) : <Lock size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">Step {i + 1}: {st.name}</h3>
                      {current && <Badge tone="amber">Your current step</Badge>}
                      {ok && !current && <Badge tone="emerald">Unlocked</Badge>}
                    </div>
                    <p className="text-sm mt-1"><span className="text-neutral-500">Requirement:</span> <span className={ok ? 'text-emerald-300' : 'text-neutral-300'}>{reqText(st) || 'None'}</span></p>
                    <p className="text-sm mt-0.5 flex items-center gap-1.5"><Target size={13} className="text-amber-400" /><span className="text-neutral-500">Goal to advance:</span> <span className="text-white">{st.goal}</span></p>
                    <p className="text-xs text-neutral-400 mt-1">{st.cue}</p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-neutral-500">Steps unlock automatically from your benchmarks. Update them in Customize Profile or the Progress Tracker.</p>
      </div>
    </div>
  );
}
