import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-neutral-900/70 border border-neutral-800 rounded-2xl ${className}`}>{children}</div>;
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'amber' | 'emerald' | 'red' | 'sky' }) {
  const tones = {
    neutral: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    amber: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    emerald: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    red: 'bg-red-400/10 text-red-300 border-red-400/30',
    sky: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
  };
  return <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${tones[tone]}`}>{children}</span>;
}

export function Stat({ label, value, sub, tone = 'white' }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'white' | 'amber' | 'emerald' }) {
  const c = tone === 'amber' ? 'text-amber-400' : tone === 'emerald' ? 'text-emerald-400' : 'text-white';
  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3">
      <div className="text-xs uppercase tracking-wide text-neutral-400">{label}</div>
      <div className={`text-xl font-bold mt-0.5 tabular-nums ${c}`}>{value}</div>
      {sub && <div className="text-xs text-neutral-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export function Difficulty({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Difficulty ${n} of 5`} title={`Difficulty ${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`w-1.5 h-3 rounded-sm ${i <= n ? 'bg-amber-400' : 'bg-neutral-700'}`} />
      ))}
    </span>
  );
}

export function Btn({ children, onClick, variant = 'ghost', className = '', type = 'button', disabled }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'emerald' | 'ghost' | 'danger'; className?: string; type?: 'button' | 'submit'; disabled?: boolean;
}) {
  const v = {
    primary: 'bg-amber-400 text-neutral-950 hover:bg-amber-300 font-semibold',
    emerald: 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-semibold',
    ghost: 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700',
    danger: 'bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30',
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${v[variant]} ${className}`}>
      {children}
    </button>
  );
}
