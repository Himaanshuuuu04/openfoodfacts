"use client";

import React from "react";
import { Filter } from "lucide-react";

interface Category {
  id?: string;
  name?: string;
  url?: string;
  [key: string]: any;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  loading?: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  loading = false,
}: CategoryFilterProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Filter size={14} className="text-purple-600 dark:text-purple-400" />
        </div>
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Filter by Category
        </label>
      </div>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        disabled={loading}
        className="w-full px-3 py-2 text-sm border-2 border-gray-200 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium cursor-pointer hover:border-gray-300 dark:hover:border-zinc-600 shadow-sm"
      >
        <option value="">✨ All Categories</option>
        {categories.slice(0, 50).map((cat, index) => (
          <option key={cat.id || index} value={cat.id || cat.name}>
            {cat.name} · {cat.products || 0} products
          </option>
        ))}
      </select>
    </div>
  );
}
