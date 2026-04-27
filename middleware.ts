import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip auth check if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Single-segment paths like "/bozeman" or "/conifer" are public city
  // landing pages (handled by app/[area]/page.tsx). Any single segment that
  // isn't one of the known private app routes is treated as a candidate
  // city slug; the page itself returns 404 if the slug doesn't resolve.
  const PRIVATE_TOP_LEVEL = new Set([
    'dashboard', 'search', 'review', 'compare', 'watchlist',
    'areas', 'clients', 'account', 'onboarding', 'admin',
    'verify', 'verification',
  ]);
  const path = request.nextUrl.pathname;
  const segments = path.split('/').filter(Boolean);
  const isCityPage = segments.length === 1 && !PRIVATE_TOP_LEVEL.has(segments[0]);

  // Redirect unauthenticated users to login (except auth pages and API routes)
  const isPublicPage = path === '/' ||
    path.startsWith('/login') ||
    path.startsWith('/signup') ||
    path.startsWith('/reset-password') ||
    path.startsWith('/score/') ||
    path.startsWith('/legal/') ||
    path.startsWith('/api/v1/') ||
    isCityPage;
  const isApiRoute = path.startsWith('/api');

  if (!user && !isPublicPage && !isApiRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
