import Link from 'next/link';
import { Anime } from '@/types/anime';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`} className="block">
      <div className="border rounded-lg p-4 shadow-md bg-white cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105">
        <div className="relative w-full h-48">
          <img
            src={anime.main_picture?.medium}
            alt={anime.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <h3 className="text-lg font-semibold mt-3 text-center">
          {anime.title}
        </h3>
      </div>
    </Link>
  );
}
