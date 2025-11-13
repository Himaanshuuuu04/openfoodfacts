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
        <Filter size={20} className="text-gray-600 dark:text-gray-400" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by Category
        </label>
      </div>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        disabled={loading}
        className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">All Categories</option>
        {categories.slice(0, 50).map((cat, index) => (
          <option key={cat.id || index} value={cat.id || cat.name}>
            {cat.name} ({cat.products || 0})
          </option>
        ))}
      </select>
    </div>
  );
}
