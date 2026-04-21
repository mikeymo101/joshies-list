import { MapPin } from 'lucide-react';

export interface ScoreCardProps {
  /** e.g. "Sarah M." */
  name: string;
  /** e.g. "Austin, TX 78701" */
  location: string;
  /** "A" | "B" | "C" | "D" | "F" */
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** out of 5.0 */
  score: number;
  reviewCount: number;
  /** 0–100, or null if no data */
  wouldWorkAgainPct: number | null;
  /** 0–5 each */
  rubric: {
    payment: number;
    postJob: number;
    scope: number;
    professionalism: number;
    access: number;
  };
  /** Optional flag — shows "Sample" pill top-right */
  sample?: boolean;
}

const GRADE_CONFIG: Record<ScoreCardProps['grade'], {
  ring: string;
  text: string;
  glow: string;
  verdict: string;
}> = {
  A: { ring: 'border-grade-a/60 bg-grade-a/10', text: 'text-grade-a', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.18)]', verdict: 'Bid with confidence' },
  B: { ring: 'border-grade-b/60 bg-grade-b/10', text: 'text-grade-b', glow: 'shadow-[0_0_40px_rgba(59,130,246,0.18)]', verdict: 'Generally safe'       },
  C: { ring: 'border-grade-c/60 bg-grade-c/10', text: 'text-grade-c', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.20)]', verdict: 'Think twice'         },
  D: { ring: 'border-grade-d/60 bg-grade-d/10', text: 'text-grade-d', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.22)]', verdict: 'Proceed with caution'},
  F: { ring: 'border-grade-f/60 bg-grade-f/10', text: 'text-grade-f', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.22)]',  verdict: 'Walk away'           },
};

const RUBRIC_LABELS: Array<[keyof ScoreCardProps['rubric'], string]> = [
  ['payment',         'Pays on Time'],
  ['postJob',         'No Surprises After'],
  ['scope',           'Sticks to the Plan'],
  ['professionalism', 'Easy to Work With'],
  ['access',          'Site Ready & On Time'],
];

/** Five filled/empty dots — reads faster than a thin progress bar at glance. */
function DotMeter({ value }: { value: number }) {
  const filled = Math.round(value); // 0–5
  return (
    <div className="flex items-center gap-1" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < filled ? 'bg-white/85' : 'bg-white/12'}`}
        />
      ))}
    </div>
  );
}

export default function ScoreCard({
  name,
  location,
  grade,
  score,
  reviewCount,
  wouldWorkAgainPct,
  rubric,
  sample,
}: ScoreCardProps) {
  const g = GRADE_CONFIG[grade];

  return (
    <article className={`relative rounded-2xl border border-white/8 bg-surface-raised p-6 lg:p-8 ${g.glow}`}>
      {sample && (
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
          Sample
        </div>
      )}

      {/* Hero: grade glyph is the lead. Everything else orbits it. */}
      <header className="flex items-start gap-5">
        <div className={`w-20 h-20 shrink-0 flex items-center justify-center rounded-xl border-2 font-black text-4xl backdrop-blur-sm ${g.ring} ${g.text}`}>
          {grade}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <div className={`text-[11px] uppercase tracking-[0.14em] font-semibold ${g.text}`}>
            Verdict
          </div>
          <div className={`text-xl md:text-2xl font-bold leading-tight mt-0.5 ${g.text}`}>
            {g.verdict}
          </div>
          <h3 className="text-base text-white/90 mt-2 font-semibold">{name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-white/45 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
        </div>
      </header>

      {/* Consensus strip — single row, no competing headline numbers */}
      <div className="mt-6 flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/6">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/35 font-semibold">
            Contractor consensus
          </div>
          <div className="text-sm text-white/80 mt-0.5">
            {wouldWorkAgainPct !== null ? (
              <>
                <span className="font-bold text-white">{wouldWorkAgainPct}%</span>{' '}
                <span className="text-white/55">would work with {name.split(' ')[0]} again</span>
              </>
            ) : (
              <span className="text-white/45">Not enough data yet</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-white/35 font-semibold">Score</div>
          <div className="text-sm mt-0.5">
            <span className="font-bold text-white">{score.toFixed(1)}</span>
            <span className="text-white/45">/5 · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
          </div>
        </div>
      </div>

      {/* Rubric — dot meters, not progress bars. Reads as a report card. */}
      <dl className="mt-5 space-y-2.5">
        {RUBRIC_LABELS.map(([key, label]) => (
          <div key={key} className="flex items-center justify-between gap-4 py-1">
            <dt className="text-[13px] text-white/65">{label}</dt>
            <dd className="flex items-center gap-3">
              <DotMeter value={rubric[key]} />
              <span className="text-[13px] font-semibold text-white/85 tabular-nums w-8 text-right">
                {rubric[key].toFixed(1)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
