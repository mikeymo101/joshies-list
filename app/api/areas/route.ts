import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Get all clients with scores
    const { data: clients } = await admin
      .from('clients')
      .select('zip_code, city, state, score, grade, review_count, would_work_again_pct')
      .not('score', 'is', null)
      .gt('review_count', 0);

    if (!clients || clients.length === 0) {
      return NextResponse.json({ areas: [] });
    }

    // Group by zip code
    const zipMap = new Map<string, {
      zip_code: string;
      city: string;
      state: string;
      totalScore: number;
      count: number;
      totalReviews: number;
      wouldWorkAgainSum: number;
      wouldWorkAgainCount: number;
    }>();

    for (const c of clients) {
      const existing = zipMap.get(c.zip_code);
      if (existing) {
        existing.totalScore += c.score!;
        existing.count += 1;
        existing.totalReviews += c.review_count;
        if (c.would_work_again_pct !== null) {
          existing.wouldWorkAgainSum += c.would_work_again_pct;
          existing.wouldWorkAgainCount += 1;
        }
      } else {
        zipMap.set(c.zip_code, {
          zip_code: c.zip_code,
          city: c.city,
          state: c.state,
          totalScore: c.score!,
          count: 1,
          totalReviews: c.review_count,
          wouldWorkAgainSum: c.would_work_again_pct ?? 0,
          wouldWorkAgainCount: c.would_work_again_pct !== null ? 1 : 0,
        });
      }
    }

    const areas = Array.from(zipMap.values())
      .map(a => ({
        zip_code: a.zip_code,
        city: a.city,
        state: a.state,
        avgScore: Math.round((a.totalScore / a.count) * 10) / 10,
        grade: getGrade(a.totalScore / a.count),
        clientCount: a.count,
        reviewCount: a.totalReviews,
        wouldWorkAgainPct: a.wouldWorkAgainCount > 0
          ? Math.round(a.wouldWorkAgainSum / a.wouldWorkAgainCount)
          : null,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    return NextResponse.json({ areas });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

function getGrade(score: number): string {
  if (score >= 4.5) return 'A';
  if (score >= 3.5) return 'B';
  if (score >= 2.5) return 'C';
  if (score >= 1.5) return 'D';
  return 'F';
}
