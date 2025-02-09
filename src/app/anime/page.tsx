'use client';

import { useEffect, useState } from 'react';
import AnimeList from '@/components/modules/AnimeList';
import SearchBar from '@/components/modules/SearchBar';
import { Anime, AnimeListResponse } from '@/types/anime';

export default function AnimePage() {
  const [animeList, setAnimeList] = useState<
    Record<string, AnimeListResponse['data']>
  >({});
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<
    Record<string, AnimeListResponse['data']>
  >({});

  const fetchAnimeList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/anime');
      if (!res.ok) throw new Error('Failed to fetch anime list');
      const data: Record<string, AnimeListResponse['data']> = await res.json();
      setAnimeList(data);
    } catch (error: any) {
      setError(error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeList();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Search Bar */}
      <SearchBar
        setSearchResults={setSearchResults}
        animeList={animeList}
        query={query}
        setQuery={setQuery}
      />

      {/* Conditional Rendering: Search Results or Anime List */}
      {query.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold border-b pb-2">
            Search Results from My Anime List
          </h2>
          <AnimeList anime={searchResults} fetchAnimeList={fetchAnimeList} />
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold border-b pb-2">
            My Anime List
          </h2>
          {loading ? (
            <p className="text-center text-gray-600 mt-4">
              Loading anime list...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4">{error}</p>
          ) : Object.keys(animeList).length > 0 ? (
            <div>
              {Object.entries(animeList).map(
                ([status, list]) =>
                  list.length > 0 && (
                    <div key={status} className="mt-6">
                      <h3 className="text-xl font-semibold capitalize border-b pb-2">
                        {status.replace('_', ' ')}
                      </h3>
                      <AnimeList
                        anime={{ [status]: list }}
                        fetchAnimeList={fetchAnimeList}
                      />
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No anime found.</p>
          )}
        </div>
      )}
    </div>
  );
}
