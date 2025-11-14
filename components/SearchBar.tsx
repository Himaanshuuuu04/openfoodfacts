"use client";

import React, { useState, useCallback } from "react";
import { Search, Barcode, Sparkles } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {searchType === "name" ? (
              <Search size={16} />
            ) : (
              <Barcode size={16} />
            )}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchType === "name"
                ? "Search for delicious products..."
                : "Enter barcode number..."
            }
            className="w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800 dark:text-white placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
          />
        </div>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "name" | "barcode")}
          className="px-3 py-2 text-sm border-2 border-gray-200 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium cursor-pointer hover:border-gray-300 dark:hover:border-zinc-600 shadow-sm"
        >
          <option value="name">🔍 By Name</option>
          <option value="barcode">🏷️ By Barcode</option>
        </select>

        <button
          type="submit"
          className="px-5 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
        >
          <Sparkles
            size={14}
            className="group-hover:rotate-12 transition-transform"
          />
          Search
        </button>
      </div>
    </form>
  );
}
