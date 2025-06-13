import { NextRequest, NextResponse } from 'next/server';
import { getGitHubStats } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const repo = searchParams.get('repo');

    if (!username || !repo) {
      return NextResponse.json(
        { error: 'Username and repo parameters are required' },
        { status: 400 }
      );
    }

    const stats = await getGitHubStats(username, repo);

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('GitHub stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' },
      { status: 500 }
    );
  }
}
