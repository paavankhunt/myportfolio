import { Manga } from '@/types/anime';
import Link from 'next/link';

interface MangaCardProps {
  manga: Manga;
  status?: string; // Status from user's list
}

export default function MangaCard({ manga, status }: MangaCardProps) {
  // Define badge colors based on status
  const statusColors: Record<string, string> = {
    reading: 'bg-blue-500',
    completed: 'bg-green-500',
    on_hold: 'bg-yellow-500',
    dropped: 'bg-red-500',
    plan_to_read: 'bg-gray-500',
  };

  return (
    <Link href={`/manga/${manga.id}`} className="block">
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
            src={manga.main_picture?.medium}
            alt={manga.title}
            className="w-full h-full object-cover rounded-md border border-gray-600 shadow-md"
          />
        </div>

        {/* Manga Title */}
        <h3 className="text-lg font-semibold mt-3 text-center text-gray-300">
          {manga.alternative_titles?.en || manga.title}
        </h3>
      </div>
    </Link>
  );
}
