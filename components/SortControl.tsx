"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortControlProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, order: "asc" | "desc") => void;
}

export default function SortControl({
  sortBy,
  sortOrder,
  onSortChange,
}: SortControlProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <ArrowUpDown
            size={14}
            className="text-green-600 dark:text-green-400"
          />
        </div>
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Sort By
        </label>
      </div>

      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, sortOrder)}
          className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium cursor-pointer hover:border-gray-300 dark:hover:border-zinc-600 shadow-sm"
        >
          <option value="unique_scans_n">🔥 Popularity</option>
          <option value="name">🔤 Product Name</option>
          <option value="nutrition_grade">⭐ Nutrition Grade</option>
        </select>

        <button
          onClick={() =>
            onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
          }
          className="px-4 py-2 text-sm border-2 border-gray-200 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 dark:hover:border-green-600 transition-all font-bold shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
}
