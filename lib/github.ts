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
    console.log(`Fetching GitHub stats for ${username}/${repo}`);

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'PixelFly-App'
    };

    // Add GitHub token if available (supports both classic and fine-grained tokens)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      console.log('Using GitHub token for authentication');
    }

    const response = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
      headers,
      // Cache for 5 minutes to avoid hitting rate limits
      next: { revalidate: 300 }
    });

    console.log(`GitHub API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status} - ${errorText}`);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const data: GitHubRepo = await response.json();
    console.log(`GitHub stats fetched successfully:`, {
      stars: data.stargazers_count,
      forks: data.forks_count
    });

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




