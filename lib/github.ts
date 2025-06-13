interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
}

interface GitHubApiResponse {
  stars: number;
  forks: number;
  watchers: number;
  issues: number;
  lastUpdated: string;
}

export async function getGitHubStats(username: string, repo: string): Promise<GitHubApiResponse> {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add GitHub token if you have one to avoid rate limiting
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      },
      // Cache for 5 minutes to avoid hitting rate limits
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubRepo = await response.json();

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      issues: data.open_issues_count,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    // Return fallback data if API fails
    return {
      stars: 0,
      forks: 0,
      watchers: 0,
      issues: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Client-side hook for real-time updates
export function useGitHubStats(username: string, repo: string) {
  const [stats, setStats] = useState<GitHubApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch(`/api/github-stats?username=${username}&repo=${repo}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub stats');
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set fallback data
        setStats({
          stars: 0,
          forks: 0,
          watchers: 0,
          issues: 0,
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    // Update every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [username, repo]);

  return { stats, loading, error };
}

// Add this import at the top
import { useState, useEffect } from 'react';
