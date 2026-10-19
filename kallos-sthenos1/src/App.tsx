import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, Dumbbell, HeartPulse, Salad, Trophy, UserCog } from 'lucide-react';
import ProfileModal, { DEFAULT_PROFILE } from './components/ProfileModal';
import { KEYS, load, save } from './lib/storage';
import { computeTargets } from './lib/nutrition';
import { generateSchedule, scheduleSignature } from './lib/workout';
import { generateMealPlan, mealSignature } from './lib/mealPlan';
import { levelInfo } from './lib/level';
import type { BenchLog, CompletedSession, MealPlan, Profile, WorkoutSchedule } from './types';

const WorkoutView = lazy(() => import('./views/WorkoutView'));
const NutritionView = lazy(() => import('./views/NutritionView'));
const SkillsView = lazy(() => import('./views/SkillsView'));
const LibraryView = lazy(() => import('./views/LibraryView'));
const RehabView = lazy(() => import('./views/RehabView'));
const ProgressView = lazy(() => import('./views/ProgressView'));

const TABS = [
  { id: 'workout', label: 'Workout Plan', icon: Dumbbell },
  { id: 'nutrition', label: 'Nutrition & Meals', icon: Salad },
  { id: 'skills', label: 'Calisthenics Skills', icon: Trophy },
  { id: 'library', label: 'Exercise Library', icon: BookOpen },
  { id: 'rehab', label: 'Rehab & Recovery', icon: HeartPulse },
  { id: 'progress', label: 'Progress Tracker', icon: Activity },
] as const;
type TabId = (typeof TABS)[number]['id'];

function initialProfile(): Profile {
  const p = load<Profile | null>(KEYS.profile, null);
  return p ? { ...DEFAULT_PROFILE, ...p, benchmarks: { ...DEFAULT_PROFILE.benchmarks, ...p.benchmarks } } : DEFAULT_PROFILE;
}

export default function App() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  // Requirement: the Customize Profile modal opens on every load / refresh.
  const [showProfile, setShowProfile] = useState(true);
  const [tab, setTab] = useState<TabId>('workout');
  const targets = useMemo(() => computeTargets(profile), [profile]);

  const [schedule, setSchedule] = useState<WorkoutSchedule>(() => {
    const s = load<WorkoutSchedule | null>(KEYS.workout, null);
    return s && s.sig === scheduleSignature(profile) ? s : generateSchedule(profile);
  });
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    const m = load<MealPlan | null>(KEYS.meals, null);
    return m && m.sig === mealSignature(profile, targets) ? m : generateMealPlan(profile, targets);
  });
  const [sessions, setSessions] = useState<CompletedSession[]>(() => load(KEYS.sessions, []));
  const [benchLog, setBenchLog] = useState<BenchLog[]>(() => load(KEYS.benchLog, []));

  // Regenerate plans only when the inputs they depend on change.
  useEffect(() => {
    if (schedule.sig !== scheduleSignature(profile)) setSchedule(generateSchedule(profile));
    if (mealPlan.sig !== mealSignature(profile, targets)) setMealPlan(generateMealPlan(profile, targets));
  }, [profile, targets]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => save(KEYS.profile, profile), [profile]);
  useEffect(() => save(KEYS.workout, schedule), [schedule]);
  useEffect(() => save(KEYS.meals, mealPlan), [mealPlan]);
  useEffect(() => save(KEYS.sessions, sessions), [sessions]);
  useEffect(() => save(KEYS.benchLog, benchLog), [benchLog]);

  const onSaveProfile = useCallback((p: Profile) => {
    setProfile(p);
    setShowProfile(false);
    setBenchLog((log) => {
      const last = log[log.length - 1];
      if (last && JSON.stringify(last.values) === JSON.stringify(p.benchmarks)) return log;
      return [...log, { date: new Date().toISOString(), values: p.benchmarks }];
    });
  }, []);
  const closeProfile = useCallback(() => setShowProfile(false), []);
  const lvl = levelInfo(profile.benchmarks);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 pt-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 grid place-items-center font-black text-lg">Κ</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white leading-tight tracking-tight">Kallos Sthenos</h1>
            <p className="text-xs text-neutral-400 truncate">Beauty & Strength · {lvl.name} · {targets.kcal} kcal · {profile.days}x/week · {profile.duration} min</p>
          </div>
          <button onClick={() => setShowProfile(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-sm text-neutral-200 hover:border-amber-400/60">
            <UserCog size={16} className="text-amber-400" /><span className="hidden sm:inline">Customize Profile</span>
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-2 mt-2 flex gap-1 overflow-x-auto no-scrollbar" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3 py-2.5 text-sm border-b-2 transition-colors ${tab === id ? 'border-amber-400 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}>
              <Icon size={16} className={tab === id ? (id === 'nutrition' ? 'text-emerald-400' : 'text-amber-400') : ''} />{label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 pb-24">
        <Suspense fallback={<div className="py-20 text-center text-neutral-500">Loading…</div>}>
          {tab === 'workout' && <WorkoutView profile={profile} schedule={schedule} setSchedule={setSchedule} sessions={sessions} setSessions={setSessions} />}
          {tab === 'nutrition' && <NutritionView profile={profile} targets={targets} plan={mealPlan} setPlan={setMealPlan} />}
          {tab === 'skills' && <SkillsView profile={profile} />}
          {tab === 'library' && <LibraryView profile={profile} />}
          {tab === 'rehab' && <RehabView />}
          {tab === 'progress' && <ProgressView profile={profile} setProfile={setProfile} sessions={sessions} setSessions={setSessions} benchLog={benchLog} setBenchLog={setBenchLog} />}
        </Suspense>
      </main>

      <footer className="text-center text-xs text-neutral-500 pb-8 px-4">
        Educational guidance only, not medical advice. Stop any exercise that causes sharp pain. Photos from Unsplash.
      </footer>

      <ProfileModal open={showProfile} profile={profile} onSave={onSaveProfile} onClose={closeProfile} />
    </div>
  );
}
