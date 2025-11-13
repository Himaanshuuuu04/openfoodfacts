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
        <ArrowUpDown size={20} className="text-gray-600 dark:text-gray-400" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort By
        </label>
      </div>

      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, sortOrder)}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="unique_scans_n">Popularity</option>
          <option value="name">Product Name</option>
          <option value="nutrition_grade">Nutrition Grade</option>
        </select>

        <button
          onClick={() =>
            onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
          }
          className="px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
}
