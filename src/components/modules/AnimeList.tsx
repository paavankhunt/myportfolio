import AnimeCard from './AnimeCard';
import { AnimeListResponse } from '@/types/anime';

interface AnimeListProps {
  anime: Record<string, AnimeListResponse['data']>; // Updated type
  fetchAnimeList: () => void;
}

export default function AnimeList({ anime, fetchAnimeList }: AnimeListProps) {
  console.log('🚀 ~ AnimeList ~ anime:', anime);
  const statuses = Object.keys(anime);

  return (
    <div className="mt-4">
      {statuses.length > 0 ? (
        statuses.map((status) => (
          <div key={status} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <p className="text-center text-gray-500 text-lg mt-6">
          No anime found.
        </p>
      )}
    </div>
  );
}
