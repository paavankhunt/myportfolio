'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';
import { Manga } from '@/types/anime';

export default function MangaDetails({ params }: { params: { id: string } }) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchManga() {
      try {
        const res = await axios.get(`/api/manga/${params.id}`);
        const data = await res.data;
        if (data.status === 401 && data.redirect_url) {
          console.log('🔄 Redirecting to MyAnimeList login...');
          window.location.href = data.redirect_url;
          return;
        }
        setManga(data);
      } catch (error) {
        toast.error('Failed to fetch manga.');
      } finally {
        setLoading(false);
      }
    }

    fetchManga();
  }, [params.id]);

  if (loading)
    return (
      <p className="text-center text-xl text-white animate-pulse">Loading...</p>
    );
  if (!manga)
    return <p className="text-center text-xl text-red-500">Manga not found.</p>;

  return (
    <div className="min-h-screen mx-auto p-6 bg-gray-900 text-white shadow-lg">
      {/* Manga Header */}
      <div className="flex flex-col md:flex-row gap-8 bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Manga Cover Image */}
        <img
          src={manga.main_picture?.large}
          alt={manga.title}
          className="rounded-lg w-72 h-auto shadow-lg border border-gray-700"
        />

        {/* Manga Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-400">
            {manga.alternative_titles?.en || manga.title}
          </h1>
          <p className="text-gray-400 italic">{manga.title}</p>
          <p className="text-gray-300">
            <strong>Rank:</strong> #{manga.rank} | <strong>Score:</strong>{' '}
            {manga.mean} ⭐
          </p>
          <p className="text-gray-300">
            <strong>Popularity:</strong> {manga.popularity} |{' '}
            <strong>Volumes:</strong> {manga.num_volumes} |{' '}
            <strong>Chapters:</strong> {manga.num_chapters}
          </p>
          <p className="text-gray-300">
            <strong>Published:</strong> {manga.start_date} to{' '}
            {manga.end_date || '?'}
          </p>
          <p className="text-gray-300">
            <strong>Status:</strong> {manga.status}
          </p>

          {/* Genres & Authors */}
          {manga.genres?.length > 0 && (
            <p className="mt-2 text-gray-400">
              <strong>Genres:</strong>{' '}
              {manga.genres.map((g) => g.name).join(', ')}
            </p>
          )}

          {manga.authors?.length > 0 && (
            <p className="mt-2 text-gray-400">
              <strong>Authors:</strong>{' '}
              {manga.authors.map((a) => a.name).join(', ')}
            </p>
          )}

          {/* My List Status */}
          {manga.my_list_status && (
            <div className="mt-4 p-4 border border-gray-600 rounded-lg bg-gray-700 bg-opacity-50 shadow-md">
              <h2 className="text-lg font-semibold text-blue-300">
                My List Status
              </h2>
              <p>
                <strong>Status:</strong> {manga.my_list_status.status}
              </p>
              <p>
                <strong>Score:</strong> {manga.my_list_status.score || 'N/A'}
              </p>
              <p>
                <strong>Read Chapters:</strong>{' '}
                {manga.my_list_status.num_chapters_read || 0} /{' '}
                {manga.num_chapters}
              </p>
              <p>
                <strong>Read Volumes:</strong>{' '}
                {manga.my_list_status.num_volumes_read || 0} /{' '}
                {manga.num_volumes}
              </p>
            </div>
          )}

          {/* Synopsis */}
          <p className="mt-6 text-gray-300 leading-relaxed">{manga.synopsis}</p>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-10">
        {/* Background */}
        {manga.background && (
          <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold text-blue-300">Background</h2>
            <p className="text-gray-400 mt-2">{manga.background}</p>
          </div>
        )}

        {/* Recommendations */}
        {manga.recommendations?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-blue-300">Recommendations</h2>
            <div className="flex gap-4 overflow-x-auto p-2">
              {manga.recommendations.map((rec) => (
                <Link href={`/manga/${rec.node.id}`} key={rec.node.id}>
                  <div className="w-48 flex-shrink-0 bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 hover:bg-gray-700 transition duration-300">
                    <img
                      src={rec.node.main_picture?.medium}
                      alt={rec.node.title}
                      className="w-full rounded-lg shadow-md"
                    />
                    <p className="text-sm mt-2 text-center text-gray-300">
                      {rec.node.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
