import { useState } from 'react';
import { AlertOctagon, ArrowDown, Flame, Gauge, HeartPulse } from 'lucide-react';
import { Card } from '../components/ui';
import { PROTOCOLS } from '../data/rehab';

export default function RehabView() {
  const [sel, setSel] = useState(PROTOCOLS[0].id);
  const p = PROTOCOLS.find((x) => x.id === sel)!;

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {PROTOCOLS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-sm border ${sel === x.id ? 'border-amber-400 bg-amber-400/10 text-amber-200' : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600'}`}>{x.name}</button>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-2"><HeartPulse className="text-amber-400" size={20} /><h2 className="text-xl font-bold text-white">{p.name}</h2></div>
        <p className="text-neutral-300 text-sm leading-relaxed">{p.biomechanics}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.commonIssues.map((c) => <span key={c} className="text-xs px-2 py-1 rounded-lg bg-neutral-800 text-neutral-300">{c}</span>)}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <Card className="p-4">
          <h3 className="flex items-center gap-2 font-semibold text-white mb-3"><Flame size={16} className="text-amber-400" /> Warm-up Activation</h3>
          <ol className="space-y-2">
            {p.warmup.map((w, i) => (
              <li key={w.name} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 grid place-items-center text-xs font-semibold">{i + 1}</span>
                <span className="flex-1 text-neutral-200">{w.name}</span>
                <span className="text-emerald-300 tabular-nums text-xs">{w.dose}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-4">
          <h3 className="flex items-center gap-2 font-semibold text-white mb-3"><ArrowDown size={16} className="text-sky-400" /> Pain-Free Regressions</h3>
          <ul className="space-y-2.5 text-sm">
            {p.regressions.map((r) => (
              <li key={r.from} className="rounded-lg bg-neutral-950 border border-neutral-800 p-2.5">
                <div className="text-neutral-500 text-xs">If {r.from} hurts</div>
                <div className="text-neutral-200">→ {r.to}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="flex items-center gap-2 font-semibold text-white mb-3"><Gauge size={16} className="text-emerald-400" /> Load Management</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-neutral-300">{p.load.map((l) => <li key={l}>{l}</li>)}</ul>
        </Card>

        <Card className="p-4 border-red-500/30">
          <h3 className="flex items-center gap-2 font-semibold text-white mb-3"><AlertOctagon size={16} className="text-red-400" /> See a Professional If</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-red-100/90">{p.redFlags.map((l) => <li key={l}>{l}</li>)}</ul>
        </Card>
      </div>
      <p className="text-xs text-neutral-500">General education, not a diagnosis. Persistent or severe pain should be assessed by a physiotherapist or doctor.</p>
    </div>
  );
}
