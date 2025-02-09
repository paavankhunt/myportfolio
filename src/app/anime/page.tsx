'use client';

import { useEffect, useState } from 'react';
import AnimeList from '@/components/modules/AnimeList';
import SearchBar from '@/components/modules/SearchBar';
import { AnimeListResponse } from '@/types/anime';

export default function AnimePage() {
  const [animeList, setAnimeList] = useState<AnimeListResponse['data']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<AnimeListResponse['data']>(
    []
  );

  const fetchAnimeList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/anime');
      if (!res.ok) throw new Error('Failed to fetch anime list');
      const data: AnimeListResponse = await res.json();
      setAnimeList(data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeList();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">My Anime List</h1>

      {/* Search Bar */}
      <SearchBar setSearchResults={setSearchResults} animeList={animeList} />

      {/* Conditional Rendering: Search Results or Anime List */}
      {searchResults.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold border-b pb-2">
            Search Results
          </h2>
          <AnimeList anime={searchResults} fetchAnimeList={fetchAnimeList} />
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold border-b pb-2">My Anime</h2>
          {loading ? (
            <p className="text-center text-gray-600 mt-4">
              Loading anime list...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4">{error}</p>
          ) : animeList.length > 0 ? (
            <AnimeList anime={animeList} fetchAnimeList={fetchAnimeList} />
          ) : (
            <p className="text-center text-gray-500 mt-4">No anime found.</p>
          )}
        </div>
      )}
    </div>
  );
}
