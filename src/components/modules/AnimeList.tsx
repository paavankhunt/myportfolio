import AnimeCard from './AnimeCard';
import { AnimeListResponse } from '@/types/anime';

interface AnimeListProps {
  anime: Record<string, AnimeListResponse['data']>;
  fetchAnimeList: () => void;
}

export default function AnimeList({ anime, fetchAnimeList }: AnimeListProps) {
  const statuses = Object.keys(anime);

  return (
    <div className="mt-6">
      {statuses.length > 0 ? (
        statuses.map((status) => (
          <div key={status} className="mb-8">
            {/* Anime Grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                         gap-6 mt-4"
            >
              {anime[status].map((item) => (
                <AnimeCard
                  key={item.node.id}
                  anime={item.node}
                  status={status}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 text-lg mt-6">
          No anime found.
        </p>
      )}
    </div>
  );
}
