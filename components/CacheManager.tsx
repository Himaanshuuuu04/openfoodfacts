"use client";

import React, { useState, useEffect } from "react";
import { apiCache } from "@/lib/cache";
import { Trash2, RefreshCw, Database } from "lucide-react";

export default function CacheManager() {
  const [stats, setStats] = useState({ size: 0, keys: [] as string[] });
  const [showManager, setShowManager] = useState(false);

  const updateStats = () => {
    setStats(apiCache.getStats());
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    apiCache.clear();
    updateStats();
    alert("Cache cleared successfully!");
  };

  const handleClearExpired = () => {
    apiCache.clearExpired();
    updateStats();
    alert("Expired cache entries cleared!");
  };

  if (!showManager) {
    return (
      <button
        onClick={() => setShowManager(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 transition-colors"
        title="Cache Manager"
      >
        <Database size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl p-4 z-50 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Database size={18} />
          Cache Manager
        </h3>
        <button
          onClick={() => setShowManager(false)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Cached Entries:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {stats.size}
          </span>
        </div>

        {stats.keys.length > 0 && (
          <div className="max-h-40 overflow-y-auto mb-3 text-xs">
            <div className="space-y-1">
              {stats.keys.slice(0, 5).map((key, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-zinc-800 rounded text-gray-700 dark:text-gray-300 truncate"
                  title={key}
                >
                  {key}
                </div>
              ))}
              {stats.keys.length > 5 && (
                <div className="text-gray-500 dark:text-gray-400 text-center py-1">
                  +{stats.keys.length - 5} more...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={handleClearExpired}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
        >
          <RefreshCw size={16} />
          Clear Expired
        </button>

        <button
          onClick={handleClearCache}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
        >
          <Trash2 size={16} />
          Clear All Cache
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <p>Cache persists across page reloads using sessionStorage.</p>
      </div>
    </div>
  );
}
