import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const supabase = createSupabaseAdmin();

    // Verify token and extract user ID
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = user.id;
    const tables = [
        { name: 'candidates', role: 'candidate' },
        { name: 'employers', role: 'employer' },
        { name: 'universities', role: 'university' },
    ];

    for (const tbl of tables) {
        const { data } = await supabase.from(tbl.name).select('id').eq('id', userId).single();
        if (data) {
            return NextResponse.json({ role: tbl.role });
        }
    }
    return NextResponse.json({ role: null }, { status: 404 });
}
