interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  showValue?: boolean;
}

function getScoreColor(percentage: number) {
  if (percentage >= 90) return {
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    text: 'text-emerald-400',
  };
  if (percentage >= 80) return {
    bar: 'bg-gradient-to-r from-blue-500 to-blue-400',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]',
    text: 'text-blue-400',
  };
  if (percentage >= 60) return {
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    text: 'text-amber-400',
  };
  return {
    bar: 'bg-gradient-to-r from-red-500 to-red-400',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
    text: 'text-red-400',
  };
}

export default function ScoreBar({ label, score, maxScore = 5, showValue = true }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;
  const colors = getScoreColor(percentage);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70 font-medium">{label}</span>
        {showValue && (
          <span className={`text-sm font-semibold tabular-nums ${colors.text}`}>
            {score.toFixed(1)}<span className="text-white/30">/{maxScore}</span>
          </span>
        )}
      </div>
      <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colors.bar} ${colors.glow}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
