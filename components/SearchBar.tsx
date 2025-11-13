"use client";

import React, { useState, useCallback } from "react";
import { Search, Barcode } from "lucide-react";

interface SearchBarProps {
  onSearch: (term: string, type: "name" | "barcode") => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search products...",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "barcode">("name");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        onSearch(searchTerm.trim(), searchType);
      }
    },
    [searchTerm, searchType, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {searchType === "name" ? (
              <Search size={20} />
            ) : (
              <Barcode size={20} />
            )}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchType === "name"
                ? "Search by product name..."
                : "Search by barcode..."
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "name" | "barcode")}
          className="px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Name</option>
          <option value="barcode">Barcode</option>
        </select>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
