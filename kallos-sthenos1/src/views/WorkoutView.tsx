import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { ArrowLeftRight, CheckCircle2, ChevronDown, Clock, Moon, RefreshCw, Timer } from 'lucide-react';
import RestTimer, { type TimerRequest } from '../components/RestTimer';
import Modal from '../components/Modal';
import { Badge, Btn, Card, Difficulty } from '../components/ui';
import { EX_BY_ID, MUSCLE_LABEL } from '../data/exercises';
import { DAY_FOCUS, WEEKDAYS, dayMinutes, exerciseSeconds, generateSchedule, prescribe, swapOptions } from '../lib/workout';
import { levelInfo } from '../lib/level';
import Photo from '../components/Photo';
import { DAY_IMG } from '../data/images';
import type { CompletedSession, PlannedExercise, Profile, WorkoutSchedule } from '../types';

interface Props {
  profile: Profile;
  schedule: WorkoutSchedule;
  setSchedule: Dispatch<SetStateAction<WorkoutSchedule>>;
  sessions: CompletedSession[];
  setSessions: Dispatch<SetStateAction<CompletedSession[]>>;
}

const todayIdx = () => (new Date().getDay() + 6) % 7;

export default function WorkoutView({ profile, schedule, setSchedule, sessions, setSessions }: Props) {
  const [sel, setSel] = useState(todayIdx);
  const [timerReq, setTimerReq] = useState<TimerRequest | null>(null);
  const [done, setDone] = useState<Record<string, boolean[]>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [swapFor, setSwapFor] = useState<number | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  const day = schedule.days[sel];
  const level = levelInfo(profile.benchmarks).train;
  const minutes = dayMinutes(day);
  const ids = day.exercises.map((e) => e.id);

  const options = useMemo(
    () => (swapFor === null ? [] : swapOptions(day.type, day.exercises[swapFor].id, ids, profile.equipment)),
    [swapFor, day, profile.equipment], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const doSwap = (newId: string) => {
    if (swapFor === null) return;
    const ex = EX_BY_ID[newId];
    setSchedule((s) => ({
      ...s,
      days: s.days.map((d, i) => (i !== sel ? d : { ...d, exercises: d.exercises.map((p, j) => (j === swapFor ? prescribe(ex, level, profile.duration) : p)) })),
    }));
    setSwapFor(null);
  };

  const toggleSet = (key: string, n: number, set: number) => {
    setDone((d) => {
      const arr = [...(d[key] ?? Array(n).fill(false))];
      arr[set] = !arr[set];
      return { ...d, [key]: arr };
    });
  };

  const completeSession = () => {
    const s: CompletedSession = {
      id: `${Date.now()}`, date: new Date().toISOString(), day: day.day, type: day.type, exercises: day.exercises.length, minutes,
    };
    setSessions((list) => [...list, s]);
    setDone({});
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const weekDone = sessions.filter((s) => Date.now() - new Date(s.date).getTime() < 7 * 864e5).length;

  return (
    <div className="space-y-4">
      {/* Weekly split */}
      <div className="grid grid-cols-7 gap-1.5">
        {schedule.days.map((d, i) => (
          <button key={d.day} onClick={() => setSel(i)}
            className={`rounded-xl border py-2 px-1 text-center transition-colors ${sel === i ? 'border-amber-400 bg-amber-400/10' : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-600'}`}>
            <div className={`text-xs ${i === todayIdx() ? 'text-amber-400 font-semibold' : 'text-neutral-400'}`}>{d.day}</div>
            <div className={`text-[11px] sm:text-sm font-semibold mt-0.5 truncate ${d.type === 'Rest' ? 'text-neutral-500' : 'text-white'}`}>{d.type}</div>
          </button>
        ))}
      </div>

      <div className="sm:sticky sm:top-[104px] z-20"><RestTimer request={timerReq} /></div>

      <Photo id={DAY_IMG[day.type]} alt="" priority sizes="(min-width: 1152px) 1152px, 100vw" className="rounded-2xl border border-neutral-800">
       <div className="p-4 sm:p-5 pt-16 sm:pt-24">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs uppercase tracking-wider text-amber-400">{WEEKDAYS[sel]}</div>
            <h2 className="text-2xl font-bold text-white">{day.type} Day</h2>
            <p className="text-neutral-300 text-sm mt-0.5">{DAY_FOCUS[day.type]}</p>
          </div>
          {day.type !== 'Rest' && (
            <div className="flex flex-wrap gap-2">
              <Badge tone="amber"><Clock size={12} /> ~{minutes} / {profile.duration} min</Badge>
              <Badge>{day.exercises.length} exercises</Badge>
              <Badge tone="emerald">{weekDone} sessions this week</Badge>
            </div>
          )}
        </div>
        {day.note && <p className="mt-3 text-sm text-sky-300 bg-sky-400/10 border border-sky-400/30 rounded-lg px-3 py-2">{day.note}</p>}
       </div>
      </Photo>

      {day.type === 'Rest' ? (
        <Card className="p-8 text-center">
          <Moon className="mx-auto text-neutral-500 mb-3" size={36} />
          <h3 className="text-white font-semibold text-lg">Recovery Day</h3>
          <p className="text-neutral-400 text-sm mt-1 max-w-md mx-auto">Muscles grow between sessions. Go for a 20 to 30 minute walk, sleep 8+ hours, and run through the Rehab & Recovery warm-ups for any joint that feels beaten up.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {day.exercises.map((p: PlannedExercise, idx) => {
            const ex = EX_BY_ID[p.id];
            if (!ex) return null;
            const key = `${sel}-${idx}-${p.id}`;
            const sets = done[key] ?? Array(p.sets).fill(false);
            const finished = sets.every(Boolean);
            const expanded = open === key;
            return (
              <Card key={key} className={`p-4 transition-colors ${finished ? 'border-emerald-500/40' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 shrink-0 rounded-lg grid place-items-center text-sm font-bold ${finished ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'}`}>
                    {finished ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{ex.name}</h3>
                      <Difficulty n={ex.diff} />
                      {ex.cat === 'core' && <Badge tone="sky">Core</Badge>}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">{ex.muscles.map((m) => MUSCLE_LABEL[m]).join(' · ')}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="text-amber-300 font-semibold">{p.sets} sets × {p.target}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-300">Rest {p.restSec}s</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-400">~{Math.round(exerciseSeconds(p) / 60)} min</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {sets.map((s, i) => (
                        <button key={i} onClick={() => { toggleSet(key, p.sets, i); if (!s) setTimerReq({ seconds: p.restSec, nonce: Date.now() }); }}
                          className={`px-3 py-1.5 rounded-lg text-sm border ${s ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300' : 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-neutral-500'}`}>
                          Set {i + 1} {s && '✓'}
                        </button>
                      ))}
                      <button onClick={() => setTimerReq({ seconds: p.restSec, nonce: Date.now() })} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-amber-400/30 text-amber-300 bg-amber-400/5 hover:bg-amber-400/10">
                        <Timer size={14} /> Rest {p.restSec}s
                      </button>
                      <button onClick={() => setSwapFor(idx)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-neutral-700 text-neutral-300 bg-neutral-950 hover:border-neutral-500">
                        <ArrowLeftRight size={14} /> Swap
                      </button>
                      <button onClick={() => setOpen(expanded ? null : key)} className="ml-auto inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white">
                        Technique <ChevronDown size={14} className={expanded ? 'rotate-180' : ''} />
                      </button>
                    </div>
                    {expanded && (
                      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm border-t border-neutral-800 pt-3">
                        <div><div className="text-xs uppercase text-amber-400 mb-1">Cues</div><ul className="list-disc pl-4 text-neutral-300 space-y-0.5">{ex.cues.map((c) => <li key={c}>{c}</li>)}</ul></div>
                        <div><div className="text-xs uppercase text-red-300 mb-1">Avoid</div><ul className="list-disc pl-4 text-neutral-300 space-y-0.5">{ex.mistakes.map((c) => <li key={c}>{c}</li>)}</ul></div>
                        <p className="sm:col-span-2 text-neutral-400">{ex.anatomy}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Btn variant="emerald" onClick={completeSession}><CheckCircle2 size={16} /> Complete Session</Btn>
            <Btn onClick={() => setSchedule(generateSchedule(profile))}><RefreshCw size={16} /> Reset week to default plan</Btn>
            {savedMsg && <span className="text-sm text-emerald-400">Session logged. Nice work.</span>}
          </div>
        </div>
      )}

      <Modal open={swapFor !== null} onClose={() => setSwapFor(null)} title="Swap Exercise" icon={<ArrowLeftRight className="text-amber-400" size={20} />}>
        {swapFor !== null && (
          <>
            <p className="text-sm text-neutral-400 mb-3">Replacing <span className="text-white font-medium">{EX_BY_ID[day.exercises[swapFor].id]?.name}</span> with an equivalent {day.type.toLowerCase()} day movement for the same muscle group.</p>
            {options.length === 0 ? (
              <p className="text-sm text-neutral-400">No equivalent options with your current equipment.</p>
            ) : (
              <div className="space-y-2">
                {options.map((o) => (
                  <button key={o.id} onClick={() => doSwap(o.id)} className="w-full text-left p-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-amber-400/50">
                    <div className="flex items-center gap-2"><span className="font-medium text-white flex-1">{o.name}</span><Difficulty n={o.diff} /></div>
                    <div className="text-xs text-neutral-400 mt-0.5">{o.muscles.map((m) => MUSCLE_LABEL[m]).join(' · ')}</div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
