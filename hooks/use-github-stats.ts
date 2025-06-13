"use client";

import { useState, useEffect } from 'react';

interface GitHubApiResponse {
  stars: number;
  forks: number;
  watchers: number;
  issues: number;
  lastUpdated: string;
}

export function useGitHubStats(username: string, repo: string) {
  const [stats, setStats] = useState<GitHubApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        console.log(`Fetching stats for ${username}/${repo}`);
        
        const response = await fetch(`/api/github-stats?username=${username}&repo=${repo}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error: ${response.status} - ${errorText}`);
          throw new Error(`Failed to fetch GitHub stats: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received GitHub stats:', data);
        setStats(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error in useGitHubStats:', errorMessage);
        setError(errorMessage);
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
