import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';

function beep() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    [0, 0.25, 0.5].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.2, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.2);
    });
    navigator.vibrate?.([200, 100, 200]);
  } catch { /* audio unavailable */ }
}

export interface TimerRequest { seconds: number; nonce: number }

export default function RestTimer({ request }: { request: TimerRequest | null }) {
  const [total, setTotal] = useState(60);
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!request) return;
    setTotal(request.seconds);
    setLeft(request.seconds);
    endAt.current = Date.now() + request.seconds * 1000;
    setRunning(true);
  }, [request]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) { setRunning(false); beep(); }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  const start = (s: number) => { setTotal(s); setLeft(s); endAt.current = Date.now() + s * 1000; setRunning(true); };
  const toggle = () => {
    if (running) setRunning(false);
    else if (left > 0) { endAt.current = Date.now() + left * 1000; setRunning(true); }
    else start(total);
  };
  const pct = total ? (left / total) * 100 : 0;
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');

  return (
    <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center gap-3 backdrop-blur">
      <div className="relative w-14 h-14 shrink-0">
        <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#262626" strokeWidth="3" />
          <circle cx="18" cy="18" r="16" fill="none" stroke={left === 0 ? '#34d399' : '#fbbf24'} strokeWidth="3"
            strokeDasharray={`${(pct * 100.5) / 100} 100.5`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .25s linear' }} />
        </svg>
        <Timer size={16} className="absolute inset-0 m-auto text-neutral-400" />
      </div>
      <div className="min-w-[84px]">
        <div className="text-xs uppercase tracking-wide text-neutral-400">Rest Timer</div>
        <div className={`text-2xl font-bold tabular-nums ${left === 0 ? 'text-emerald-400' : 'text-white'}`}>{mm}:{ss}</div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {[45, 60, 75, 90].map((s) => (
          <button key={s} onClick={() => start(s)} className={`px-2.5 py-1.5 rounded-lg text-sm border ${total === s ? 'border-amber-400/50 text-amber-300 bg-amber-400/10' : 'border-neutral-700 text-neutral-300 bg-neutral-800 hover:bg-neutral-700'}`}>{s}s</button>
        ))}
      </div>
      <div className="flex gap-1.5 ml-auto">
        <button onClick={toggle} aria-label={running ? 'Pause' : 'Start'} className="p-2.5 rounded-xl bg-amber-400 text-neutral-950 hover:bg-amber-300">{running ? <Pause size={18} /> : <Play size={18} />}</button>
        <button onClick={() => { setRunning(false); setLeft(total); }} aria-label="Reset" className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700"><RotateCcw size={18} /></button>
      </div>
    </div>
  );
}
