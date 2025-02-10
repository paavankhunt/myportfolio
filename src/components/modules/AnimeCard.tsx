import Link from 'next/link';
import { Anime } from '@/types/anime';

interface AnimeCardProps {
  anime: Anime;
  status?: string; // Status from user's list
}

export default function AnimeCard({ anime, status }: AnimeCardProps) {
  // Define badge colors based on status
  const statusColors: Record<string, string> = {
    watching: 'bg-blue-500',
    completed: 'bg-green-500',
    on_hold: 'bg-yellow-500',
    dropped: 'bg-red-500',
    plan_to_watch: 'bg-gray-500',
  };

  return (
    <Link href={`/anime/${anime.id}`} className="block">
      <div
        className="relative border border-gray-700 rounded-lg p-4 shadow-md bg-gray-800 
                   cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 
                   hover:bg-gray-700 bg-opacity-90 backdrop-blur-lg"
      >
        {/* Status Badge */}
        {status && (
          <span
            className={`absolute top-2 right-2 text-xs font-semibold text-white px-2 py-1 
                        rounded shadow-md ${
                          statusColors[status] || 'bg-gray-400'
                        }`}
            style={{ zIndex: 10 }}
          >
            {status.replace('_', ' ')}
          </span>
        )}

        {/* Image with fixed height */}
        <div className="relative w-full h-64 overflow-hidden rounded-md">
          <img
            src={anime.main_picture?.medium}
            alt={anime.title}
            className="w-full h-full object-cover rounded-md border border-gray-600 shadow-md"
          />
        </div>

        {/* Anime Title */}
        <h3 className="text-lg font-semibold mt-3 text-center text-gray-300">
          {anime.alternative_titles?.en || anime.title}
        </h3>
      </div>
    </Link>
  );
}
