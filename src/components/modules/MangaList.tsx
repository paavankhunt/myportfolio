import { MangaListResponse } from '@/types/anime';
import MangaCard from './MangaCard';

interface MangaListProps {
  manga: Record<string, MangaListResponse['data']>;
  fetchMangaList: () => void;
}

export default function MangaList({ manga, fetchMangaList }: MangaListProps) {
  const statuses = Object.keys(manga);

  return (
    <div className="mt-4">
      {statuses.length > 0 ? (
        statuses.map((status) => (
          <div key={status} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {manga[status].map((item) => (
                <MangaCard
                  key={item.node.id}
                  manga={item.node}
                  status={status}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg mt-6">
          No manga found.
        </p>
      )}
    </div>
  );
}
