import AnimeCard from './AnimeCard';
import { Anime } from '@/types/anime';

interface AnimeListProps {
  anime: { node: Anime }[];
  fetchAnimeList: () => void;
}

export default function AnimeList({ anime }: AnimeListProps) {
  return (
    <div className="mt-4">
      {anime.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {anime.map((item) => (
            <AnimeCard key={item.node.id} anime={item.node} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-6">
          No anime found.
        </p>
      )}
    </div>
  );
}
