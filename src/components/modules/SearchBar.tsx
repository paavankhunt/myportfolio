import { AnimeListResponse } from '@/types/anime';
import { useState } from 'react';

interface SearchBarProps {
  animeList: Record<string, AnimeListResponse['data']>;
  setSearchResults: React.Dispatch<
    React.SetStateAction<Record<string, AnimeListResponse['data']>>
  >;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({
  setSearchResults,
  animeList,
  query,
  setQuery,
}: SearchBarProps) {
  const handleSearch = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setSearchResults(animeList); // Show full list if empty
      return;
    }

    const filteredResults: Record<string, AnimeListResponse['data']> = {};

    for (const status in animeList) {
      const filteredAnime = animeList[status].filter((anime) =>
        anime.node.title.toLowerCase().includes(value.toLowerCase())
      );

      if (filteredAnime.length > 0) {
        filteredResults[status] = filteredAnime;
      }
    }

    setSearchResults(filteredResults);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search anime from My Anime List..."
        className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
