import ScoreBar from './ui/ScoreBar';

interface ScoreBreakdownProps {
  scores: {
    payment: number;
    post_job: number;
    scope: number;
    professionalism: number;
    access: number;
  };
}

export default function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">
        Score Breakdown
      </h3>
      <div className="space-y-3">
        <ScoreBar label="Pays on Time" score={scores.payment} />
        <ScoreBar label="No Surprises After" score={scores.post_job} />
        <ScoreBar label="Sticks to the Plan" score={scores.scope} />
        <ScoreBar label="Easy to Work With" score={scores.professionalism} />
        <ScoreBar label="Site Ready & On Time" score={scores.access} />
      </div>
    </div>
  );
}
