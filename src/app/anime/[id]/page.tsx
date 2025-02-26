'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Anime } from '@/types/anime';
import axios from 'axios';
import Link from 'next/link';

export default function AnimeDetails({ params }: { params: { id: string } }) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const res = await axios.get(`/api/anime/${params.id}`);
        const data = await res.data;
        if (data.status === 401 && data.redirect_url) {
          console.log('🔄 Redirecting to MyAnimeList login...');
          window.location.href = data.redirect_url;
          return;
        }

        setAnime(res.data);
      } catch (error) {
        toast.error('Failed to fetch anime.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnime();
  }, [params.id]);

  if (loading)
    return (
      <p className="text-center text-xl text-white animate-pulse">Loading...</p>
    );
  if (!anime)
    return <p className="text-center text-xl text-red-500">Anime not found.</p>;

  return (
    // <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
    <div className="min-h-screen mx-auto p-6  bg-gray-900 text-white shadow-lg">
      {/* Anime Header */}
      <div className="flex flex-col md:flex-row gap-8 bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Anime Cover Image */}
        <img
          src={anime.main_picture?.large}
          alt={anime.title}
          className="rounded-lg w-72 h-auto shadow-lg border border-gray-700"
        />

        {/* Anime Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-400">
            {anime.alternative_titles?.en || anime.title}
          </h1>
          <p className="text-gray-400 italic">{anime.title}</p>
          <p className="text-gray-300">
            <strong>Rank:</strong> #{anime.rank} | <strong>Score:</strong>{' '}
            {anime.mean} ⭐
          </p>
          <p className="text-gray-300">
            <strong>Popularity:</strong> {anime.popularity} |{' '}
            <strong>Episodes:</strong> {anime.num_episodes}
          </p>
          <p className="text-gray-300">
            <strong>Source:</strong> {anime.source} | <strong>Rating:</strong>{' '}
            {anime.rating}
          </p>
          <p className="text-gray-300">
            <strong>Aired:</strong> {anime.start_date} to{' '}
            {anime.end_date || '?'}
          </p>
          <p className="text-gray-300">
            <strong>Status:</strong> {anime.status}
          </p>

          {/* Genres & Studios */}
          {anime.genres?.length > 0 && (
            <p className="mt-2 text-gray-400">
              <strong>Genres:</strong>{' '}
              {anime.genres.map((g) => g.name).join(', ')}
            </p>
          )}

          {anime.studios?.length > 0 && (
            <p className="mt-2 text-gray-400">
              <strong>Studios:</strong>{' '}
              {anime.studios.map((s) => s.name).join(', ')}
            </p>
          )}

          {/* My List Status */}
          {anime.my_list_status && (
            <div className="mt-4 p-4 border border-gray-600 rounded-lg bg-gray-700 bg-opacity-50 shadow-md">
              <h2 className="text-lg font-semibold text-blue-300">
                My List Status
              </h2>
              <p>
                <strong>Status:</strong> {anime.my_list_status.status}
              </p>
              <p>
                <strong>Score:</strong> {anime.my_list_status.score || 'N/A'}
              </p>
              <p>
                <strong>Watched Episodes:</strong>{' '}
                {anime.my_list_status.num_episodes_watched || 0} /{' '}
                {anime.num_episodes}
              </p>
            </div>
          )}

          {/* Synopsis */}
          <p className="mt-6 text-gray-300 leading-relaxed">{anime.synopsis}</p>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-10">
        {/* Background */}
        {anime.background && (
          <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold text-blue-300">Background</h2>
            <p className="text-gray-400 mt-2">{anime.background}</p>
          </div>
        )}

        {/* Recommendations */}
        {anime.recommendations?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-blue-300">Recommendations</h2>
            <div className="flex gap-4 overflow-x-auto p-2">
              {anime.recommendations.map((rec) => (
                <Link href={`/anime/${rec.node.id}`} key={rec.node.id}>
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
