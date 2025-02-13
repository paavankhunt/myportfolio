import { useState } from 'react';

interface SearchBarProps<T> {
  dataList: Record<string, { node: T }[]>; // Generic data list for Anime or Manga
  setSearchResults: React.Dispatch<
    React.SetStateAction<Record<string, { node: T }[]>>
  >;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export default function SearchBar<T>({
  setSearchResults,
  dataList,
  query,
  setQuery,
  placeholder = 'Search...',
}: SearchBarProps<T>) {
  const handleSearch = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setSearchResults(dataList); // Show full list if empty
      return;
    }

    const filteredResults: Record<string, { node: T }[]> = {};

    for (const status in dataList) {
      const filteredData = dataList[status].filter((item) =>
        // @ts-ignore: Assume `title` exists in the type (Anime or Manga)
        item.node.title.toLowerCase().includes(value.toLowerCase())
      );

      if (filteredData.length > 0) {
        filteredResults[status] = filteredData;
      }
    }

    setSearchResults(filteredResults);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
