import Link from 'next/link';
import type { Client } from '@/types';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import ScoreBar from './ui/ScoreBar';

interface ClientCardProps {
  client: Client;
}

function getGradeConfig(grade: string | null) {
  switch (grade) {
    case 'A': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' };
    case 'B': return { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]' };
    case 'C': return { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]' };
    case 'D': return { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]' };
    case 'F': return { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]' };
    default: return { bg: 'bg-white/5', border: 'border-white/20', text: 'text-white/40', glow: '' };
  }
}

export default function ClientCard({ client }: ClientCardProps) {
  const gradeConfig = getGradeConfig(client.grade);
  const wouldWorkAgain = (client as unknown as Record<string, unknown>).would_work_again_pct as number | null;
  const isPositive = wouldWorkAgain !== null && wouldWorkAgain >= 70;

  return (
    <Link href={`/clients/${client.id}`}>
      <div className="group w-full p-5 glass-card glass-card-hover text-left shadow-lg hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Grade badge */}
          <div className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 font-bold text-xl backdrop-blur-sm shrink-0 ${gradeConfig.bg} ${gradeConfig.border} ${gradeConfig.text} ${gradeConfig.glow}`}>
            {client.grade ?? '--'}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white/95 truncate text-lg group-hover:text-amber-300 transition-colors">
              {client.first_name} {client.last_initial}.
            </h3>

            <div className="flex items-center gap-1.5 text-sm text-white/50 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{client.city}, {client.state} {client.zip_code}</span>
            </div>

            {client.score !== null && (
              <div className="mt-4">
                <ScoreBar label="Overall Experience" score={client.score} showValue={false} />
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(251,146,60,0.15)]">
              <span className="text-xs text-white/50">
                {client.review_count} review{client.review_count !== 1 ? 's' : ''}
              </span>

              {wouldWorkAgain !== null && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{wouldWorkAgain}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
