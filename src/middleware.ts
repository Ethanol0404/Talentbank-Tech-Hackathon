import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseAdmin } from './lib/supabase';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  let expectedRole: 'candidate' | 'employer' | 'university' | null = null;
  if (pathname.startsWith('/candidate')) {
    expectedRole = 'candidate';
  } else if (pathname.startsWith('/employer')) {
    expectedRole = 'employer';
  } else if (pathname.startsWith('/university')) {
    expectedRole = 'university';
  }

  if (!expectedRole) {
    return NextResponse.next();
  }

  if (!token) {
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('sb-access-token');
      return response;
    }

    const { data: personData, error: personError } = await supabase
      .from('persons')
      .select('role')
      .eq('id', user.id)
      .single();

    if (personError || !personData || personData.role !== expectedRole) {
      const actualRole = personData?.role;
      if (actualRole === 'candidate') {
        return NextResponse.redirect(new URL('/candidate', request.url));
      } else if (actualRole === 'employer') {
        return NextResponse.redirect(new URL('/employer', request.url));
      } else if (actualRole === 'university') {
        return NextResponse.redirect(new URL('/university', request.url));
      } else {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('sb-access-token');
        return response;
      }
    }
  } catch (err) {
    console.error('Middleware auth check error:', err);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/candidate/:path*',
    '/employer/:path*',
    '/university/:path*',
  ],
};
