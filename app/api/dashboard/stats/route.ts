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

    const { data: contractor } = await admin
      .from('contractors')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!contractor) {
      return NextResponse.json({
        totalReviews: 0,
        totalClients: 0,
        avgClientScore: null,
        wouldWorkAgainPct: null,
        recentReviews: [],
        topClients: [],
        bottomClients: [],
        jobValueBreakdown: [],
      });
    }

    // Get all reviews by this contractor with client info
    const { data: reviews } = await admin
      .from('reviews')
      .select('*, clients!inner(id, first_name, last_initial, city, state, zip_code, score, grade, review_count)')
      .eq('contractor_id', contractor.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    const allReviews = reviews || [];
    const uniqueClientIds = Array.from(new Set(allReviews.map(r => r.client_id)));

    // Avg score of clients reviewed
    const clientScores = allReviews.map(r => r.weighted_score);
    const avgClientScore = clientScores.length > 0
      ? Math.round((clientScores.reduce((a, b) => a + b, 0) / clientScores.length) * 10) / 10
      : null;

    // Would work again %
    const workAgainReviews = allReviews.filter(r => r.would_work_again !== null && r.would_work_again !== undefined);
    const wouldWorkAgainPct = workAgainReviews.length > 0
      ? Math.round((workAgainReviews.filter(r => r.would_work_again === true).length / workAgainReviews.length) * 100)
      : null;

    // Top and bottom clients (by weighted_score)
    const clientMap = new Map<string, { client: Record<string, unknown>; avgScore: number; reviews: number }>();
    for (const r of allReviews) {
      const key = r.client_id;
      const existing = clientMap.get(key);
      if (existing) {
        existing.avgScore = (existing.avgScore * existing.reviews + r.weighted_score) / (existing.reviews + 1);
        existing.reviews += 1;
      } else {
        clientMap.set(key, { client: r.clients, avgScore: r.weighted_score, reviews: 1 });
      }
    }

    const clientList = Array.from(clientMap.values());
    const topClients = [...clientList].sort((a, b) => b.avgScore - a.avgScore).slice(0, 3);
    const bottomClients = [...clientList].sort((a, b) => a.avgScore - b.avgScore).slice(0, 3);

    // Job value breakdown
    const valueGroups: Record<string, { count: number; totalScore: number; wouldWorkAgain: number; total: number }> = {};
    for (const r of allReviews) {
      const val = r.job_value_range || 'Not specified';
      if (!valueGroups[val]) valueGroups[val] = { count: 0, totalScore: 0, wouldWorkAgain: 0, total: 0 };
      valueGroups[val].count += 1;
      valueGroups[val].totalScore += r.weighted_score;
      if (r.would_work_again !== null && r.would_work_again !== undefined) {
        valueGroups[val].total += 1;
        if (r.would_work_again) valueGroups[val].wouldWorkAgain += 1;
      }
    }

    const jobValueBreakdown = Object.entries(valueGroups).map(([range, data]) => ({
      range,
      count: data.count,
      avgScore: Math.round((data.totalScore / data.count) * 10) / 10,
      wouldWorkAgainPct: data.total > 0 ? Math.round((data.wouldWorkAgain / data.total) * 100) : null,
    }));

    // Seasonal trends — group by quarter
    const quarterGroups: Record<string, { count: number; totalScore: number }> = {};
    for (const r of allReviews) {
      const date = new Date(r.created_at);
      const q = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      if (!quarterGroups[q]) quarterGroups[q] = { count: 0, totalScore: 0 };
      quarterGroups[q].count += 1;
      quarterGroups[q].totalScore += r.weighted_score;
    }
    const seasonalTrends = Object.entries(quarterGroups)
      .map(([quarter, data]) => ({
        quarter,
        count: data.count,
        avgScore: Math.round((data.totalScore / data.count) * 10) / 10,
      }))
      .sort((a, b) => a.quarter.localeCompare(b.quarter));

    // Platform comparison — get all reviews for comparison
    const { data: allPlatformReviews } = await admin
      .from('reviews')
      .select('weighted_score')
      .eq('status', 'active');

    const platformAvg = allPlatformReviews && allPlatformReviews.length > 0
      ? Math.round((allPlatformReviews.reduce((s, r) => s + r.weighted_score, 0) / allPlatformReviews.length) * 10) / 10
      : null;

    return NextResponse.json({
      totalReviews: allReviews.length,
      totalClients: uniqueClientIds.length,
      avgClientScore,
      wouldWorkAgainPct,
      recentReviews: allReviews.slice(0, 5).map(r => ({
        id: r.id,
        client: r.clients,
        weighted_score: r.weighted_score,
        job_type: r.job_type,
        created_at: r.created_at,
      })),
      topClients,
      bottomClients,
      jobValueBreakdown,
      seasonalTrends,
      platformAvg,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
