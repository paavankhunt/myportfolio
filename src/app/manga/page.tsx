'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/modules/SearchBar';
import MangaList from '@/components/modules/MangaList';
import { MangaListResponse } from '@/types/anime';

export default function MangaPage() {
  const [mangaList, setMangaList] = useState<
    Record<string, MangaListResponse['data']>
  >({});
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<
    Record<string, MangaListResponse['data']>
  >({});

  const router = useRouter();

  const fetchMangaList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/manga?t=${Date.now()}`);
      if (!res.ok) throw new Error('Failed to fetch manga list');
      const data = await res.json();
      if (data.status === 401 && data.redirect_url) {
        console.log('🔄 Redirecting to MyAnimeList login...');
        window.location.href = data.redirect_url;
        return;
      }
      setMangaList(data);
    } catch (error: any) {
      setError(error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMangaList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-90 shadow-lg rounded-2xl p-6 backdrop-blur-lg">
        {/* Search Bar */}
        <SearchBar
          dataList={mangaList}
          setSearchResults={setSearchResults}
          query={query}
          setQuery={setQuery}
          placeholder="Search manga from My Manga List..."
        />

        {/* Conditional Rendering: Search Results or Manga List */}
        {query.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
              Search Results
            </h2>
            <MangaList manga={searchResults} fetchMangaList={fetchMangaList} />
          </div>
        ) : (
          <div className="mt-6">
            {loading ? (
              <p className="text-center text-gray-400 mt-4 animate-pulse">
                Loading manga list...
              </p>
            ) : error ? (
              <p className="text-center text-red-400 mt-4">{error}</p>
            ) : Object.keys(mangaList).length > 0 ? (
              <div>
                {Object.entries(mangaList).map(
                  ([status, list]) =>
                    list.length > 0 && (
                      <div key={status} className="mt-6">
                        <h3 className="text-xl font-semibold capitalize border-b border-gray-700 pb-2">
                          {status.replaceAll('_', ' ')} ({list.length})
                        </h3>
                        <MangaList
                          manga={{ [status]: list }}
                          fetchMangaList={fetchMangaList}
                        />
                      </div>
                    )
                )}
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-4">No manga found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
