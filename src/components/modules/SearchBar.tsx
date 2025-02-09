import { AnimeListResponse } from '@/types/anime';
import { useState } from 'react';

interface SearchBarProps {
  animeList: AnimeListResponse['data'];
  setSearchResults: React.Dispatch<
    React.SetStateAction<AnimeListResponse['data']>
  >;
}

export default function SearchBar({
  setSearchResults,
  animeList,
}: SearchBarProps) {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setSearchResults([]); // Show full list if empty
      return;
    }

    const filteredAnime = animeList.filter((anime) =>
      anime.node.title.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResults(filteredAnime);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search anime..."
        className="border p-2 rounded w-full"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
