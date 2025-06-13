"use client";

import { useState, useEffect } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GitHubStarButtonProps {
  username: string;
  repo: string;
  className?: string;
}

interface GitHubStats {
  stars: number;
  lastUpdated: string;
}

export function GitHubStarButton({ username, repo, className = "" }: GitHubStarButtonProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
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
        setStats({
          stars: data.stars,
          lastUpdated: data.lastUpdated
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStats({
          stars: 0,
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [username, repo]);

  const handleStarClick = () => {
    window.open(`https://github.com/${username}/${repo}`, '_blank', 'noopener,noreferrer');
  };

  const formatStarCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getLastUpdatedText = () => {
    if (!stats?.lastUpdated) return '';
    const date = new Date(stats.lastUpdated);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Updated just now';
    if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    return `Updated ${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      title={`${stats ? formatStarCount(stats.stars) : '0'} stars • ${getLastUpdatedText()}`}
    >
      <Button
        onClick={handleStarClick}
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <Star className="w-4 h-4 mr-2 text-yellow-500" />
        <span className="mr-2">Star</span>
        
        {loading ? (
          <div className="flex items-center">
            <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin mr-1" />
            <span className="text-sm">...</span>
          </div>
        ) : error ? (
          <span className="text-sm text-gray-500">0</span>
        ) : (
          <motion.span
            key={stats?.stars}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-sm font-semibold min-w-[2rem] text-center"
          >
            {stats ? formatStarCount(stats.stars) : '0'}
          </motion.span>
        )}
        
        <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
      </Button>
    </motion.div>
  );
}
