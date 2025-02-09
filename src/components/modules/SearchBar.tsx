import { AnimeListResponse } from '@/types/anime';
import { useState } from 'react';

interface SearchBarProps {
  animeList: Record<string, AnimeListResponse['data']>; // Updated type
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

    // Flatten the anime list and filter
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
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search anime from My Anime List..."
        className="border p-2 rounded w-full"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
