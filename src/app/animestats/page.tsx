'use client';

import { useEffect, useState } from 'react';
import {
  FaChartLine,
  FaTv,
  FaCheckCircle,
  FaPauseCircle,
  FaTimesCircle,
  FaListUl,
  FaClock,
  FaRedo,
  FaStar,
} from 'react-icons/fa';

interface AnimeStats {
  num_items_watching: number;
  num_items_completed: number;
  num_items_on_hold: number;
  num_items_dropped: number;
  num_items_plan_to_watch: number;
  num_items: number;
  num_days_watching: number;
  num_days_completed: number;
  num_days_on_hold: number;
  num_days_dropped: number;
  num_days: number;
  num_episodes: number;
  num_times_rewatched: number;
  mean_score: number;
}

export default function AnimeStatsPage() {
  const [stats, setStats] = useState<AnimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/animestats');
        if (!response.ok) throw new Error('Failed to fetch anime statistics');
        const data = await response.json();
        if (response.status === 401 && data.redirect_url) {
          console.log('🔄 Redirecting to MyAnimeList login...');
          window.location.href = data.redirect_url;
          return;
        }
        setStats(data);
      } catch (error: any) {
        setError(error?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading)
    return <p className="text-center text-xl text-gray-300">Loading...</p>;
  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Anime Statistics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
        {/* Basic Stats */}
        <StatCard
          label="Watching"
          value={stats?.num_items_watching ?? 0}
          icon={<FaTv />}
          color="bg-blue-500"
        />
        <StatCard
          label="Completed"
          value={stats?.num_items_completed ?? 0}
          icon={<FaCheckCircle />}
          color="bg-green-500"
        />
        <StatCard
          label="On Hold"
          value={stats?.num_items_on_hold ?? 0}
          icon={<FaPauseCircle />}
          color="bg-yellow-500"
        />
        <StatCard
          label="Dropped"
          value={stats?.num_items_dropped ?? 0}
          icon={<FaTimesCircle />}
          color="bg-red-500"
        />
        <StatCard
          label="Plan to Watch"
          value={stats?.num_items_plan_to_watch ?? 0}
          icon={<FaListUl />}
          color="bg-gray-500"
        />
        <StatCard
          label="Total Entries"
          value={stats?.num_items ?? 0}
          icon={<FaChartLine />}
          color="bg-indigo-500"
        />

        {/* Time Spent Stats */}
        <StatCard
          label="Total Days Watching"
          value={stats?.num_days.toFixed(1) ?? 0}
          icon={<FaClock />}
          color="bg-pink-500"
        />
        <StatCard
          label="Watching Days"
          value={stats?.num_days_watching.toFixed(1) ?? 0}
          icon={<FaClock />}
          color="bg-blue-400"
        />
        <StatCard
          label="Completed Days"
          value={stats?.num_days_completed.toFixed(1) ?? 0}
          icon={<FaCheckCircle />}
          color="bg-green-400"
        />
        <StatCard
          label="On Hold Days"
          value={stats?.num_days_on_hold.toFixed(1) ?? 0}
          icon={<FaPauseCircle />}
          color="bg-yellow-400"
        />
        <StatCard
          label="Dropped Days"
          value={stats?.num_days_dropped.toFixed(1) ?? 0}
          icon={<FaTimesCircle />}
          color="bg-red-400"
        />

        {/* Other Stats */}
        <StatCard
          label="Episodes Watched"
          value={stats?.num_episodes ?? 0}
          icon={<FaClock />}
          color="bg-purple-500"
        />
        <StatCard
          label="Rewatched Count"
          value={stats?.num_times_rewatched ?? 0}
          icon={<FaRedo />}
          color="bg-orange-500"
        />
        <StatCard
          label="Mean Score"
          value={(stats?.mean_score ?? 0).toFixed(2)}
          icon={<FaStar />}
          color="bg-yellow-600"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center p-6 rounded-lg shadow-lg bg-opacity-20 backdrop-blur-lg 
        border border-gray-700 transition-transform transform hover:scale-105 text-center ${color}`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-lg font-medium uppercase">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
