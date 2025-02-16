'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimeList from '@/components/modules/AnimeList';
import SearchBar from '@/components/modules/SearchBar';
import { AnimeListResponse } from '@/types/anime';

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

  const router = useRouter();

  const fetchAnimeList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/anime?t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.status === 401 && data.redirect_url) {
        console.log('🔄 Redirecting to MyAnimeList login...');
        window.location.href = data.redirect_url;
        return;
      }

      if (!res.ok) throw new Error(data?.error || 'Failed to fetch anime list');

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
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-90 shadow-lg rounded-2xl p-6 backdrop-blur-lg">
        {/* Search Bar */}
        <SearchBar
          dataList={animeList}
          setSearchResults={setSearchResults}
          query={query}
          setQuery={setQuery}
          placeholder="Search anime from My Anime List..."
        />

        {/* Conditional Rendering: Search Results or Anime List */}
        {query.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
              Search Results
            </h2>
            <AnimeList anime={searchResults} fetchAnimeList={fetchAnimeList} />
          </div>
        ) : (
          <div className="mt-6">
            {/* Title + Button in Flex Container */}
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <h2 className="text-2xl font-semibold">My Anime List</h2>

              <button
                onClick={() => router.push('/animestats')}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 
                          hover:from-purple-500 hover:to-blue-500 transition-all text-white shadow-md"
              >
                📊 View Stats
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-400 mt-4 animate-pulse">
                Loading anime list...
              </p>
            ) : error ? (
              <p className="text-center text-red-400 mt-4">{error}</p>
            ) : Object.keys(animeList).length > 0 ? (
              <div>
                {Object.entries(animeList).map(
                  ([status, list]) =>
                    list.length > 0 && (
                      <div key={status} className="mt-6">
                        <h3 className="text-xl font-semibold capitalize border-b border-gray-700 pb-2">
                          {status.replaceAll('_', ' ')} ({list.length})
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
              <p className="text-center text-gray-400 mt-4">No anime found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
