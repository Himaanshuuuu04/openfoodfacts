"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchProducts,
  selectProducts,
  selectLoading,
  selectCurrentPage,
  selectTotalPages,
  setCurrentPage,
} from "@/store/slices/homeSlice";
import {
  searchProductsByName,
  searchProductByBarcode,
  searchProductsByCategory,
  fetchAllCategories,
  selectSearchResults,
  selectBarcodeResult,
  selectCategoryProducts,
  selectAllCategories,
  selectSearchLoading,
  selectBarcodeLoading,
  selectCategoryLoading,
  selectCategoriesLoading,
  clearSearchResults,
  clearBarcodeResult,
  clearCategoryResults,
} from "@/store/slices/searchSlice";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SortControl from "@/components/SortControl";
import LoadingSpinner from "@/components/LoadingSpinner";
import CacheManager from "@/components/CacheManager";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const searchResults = useSelector(selectSearchResults);
  const barcodeResult = useSelector(selectBarcodeResult);
  const categoryProducts = useSelector(selectCategoryProducts);
  const allCategories = useSelector(selectAllCategories);

  const searchLoading = useSelector(selectSearchLoading);
  const barcodeLoading = useSelector(selectBarcodeLoading);
  const categoryLoading = useSelector(selectCategoryLoading);
  const categoriesLoading = useSelector(selectCategoriesLoading);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("unique_scans_n");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<
    "home" | "search" | "barcode" | "category"
  >("home");

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchProducts(1));
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Handle search
  const handleSearch = useCallback(
    (term: string, type: "name" | "barcode") => {
      if (type === "name") {
        dispatch(searchProductsByName(term));
        setViewMode("search");
      } else {
        dispatch(searchProductByBarcode(term));
        setViewMode("barcode");
      }
    },
    [dispatch]
  );

  // Handle category filter
  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      if (category) {
        dispatch(
          searchProductsByCategory({ category, sortBy, order: sortOrder })
        );
        setViewMode("category");
      } else {
        dispatch(clearCategoryResults());
        setViewMode("home");
        dispatch(fetchProducts(currentPage));
      }
    },
    [dispatch, sortBy, sortOrder, currentPage]
  );

  // Handle sort
  const handleSortChange = useCallback(
    (newSortBy: string, newOrder: "asc" | "desc") => {
      setSortBy(newSortBy);
      setSortOrder(newOrder);

      if (viewMode === "category" && selectedCategory) {
        dispatch(
          searchProductsByCategory({
            category: selectedCategory,
            sortBy: newSortBy,
            order: newOrder,
          })
        );
      }
    },
    [dispatch, viewMode, selectedCategory]
  );

  // Client-side sorting function
  const sortProducts = useCallback(
    (productsToSort: any[]) => {
      if (!productsToSort || productsToSort.length === 0) return [];

      const sorted = [...productsToSort];

      if (sortBy === "name") {
        sorted.sort((a: any, b: any) => {
          const aName = a.product_name || "";
          const bName = b.product_name || "";
          return sortOrder === "asc"
            ? aName.localeCompare(bName)
            : bName.localeCompare(aName);
        });
      } else if (sortBy === "nutrition_grade") {
        const gradeOrder = ["a", "b", "c", "d", "e"];
        sorted.sort((a: any, b: any) => {
          const aGrade =
            a.nutrition_grades_tags?.[0]?.replace("en:", "") ||
            a.nutriscore_grade ||
            "e";
          const bGrade =
            b.nutrition_grades_tags?.[0]?.replace("en:", "") ||
            b.nutriscore_grade ||
            "e";
          const aIndex = gradeOrder.indexOf(aGrade.toLowerCase());
          const bIndex = gradeOrder.indexOf(bGrade.toLowerCase());
          return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex;
        });
      } else if (sortBy === "unique_scans_n") {
        sorted.sort((a: any, b: any) => {
          const aScans = a.unique_scans_n || 0;
          const bScans = b.unique_scans_n || 0;
          return sortOrder === "asc" ? aScans - bScans : bScans - aScans;
        });
      }

      return sorted;
    },
    [sortBy, sortOrder]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
      dispatch(fetchProducts(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // Handle product click
  const handleProductClick = useCallback(
    (product: any) => {
      const barcode = product.code || product._id;
      if (barcode) {
        router.push(`/product/${barcode}`);
      }
    },
    [router]
  );

  // Clear filters
  const handleClearFilters = useCallback(() => {
    dispatch(clearSearchResults());
    dispatch(clearBarcodeResult());
    dispatch(clearCategoryResults());
    setSelectedCategory("");
    setViewMode("home");
    dispatch(fetchProducts(currentPage));
  }, [dispatch, currentPage]);

  // Determine which products to display
  const displayProducts = sortProducts(
    viewMode === "search"
      ? searchResults
      : viewMode === "barcode" && barcodeResult
      ? [barcodeResult]
      : viewMode === "category"
      ? categoryProducts
      : products
  );

  const isLoading =
    loading || searchLoading || barcodeLoading || categoryLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-black dark:via-zinc-900 dark:to-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md transform hover:rotate-6 transition-transform">
              <span className="text-lg">🍎</span>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OpenFoodFacts Explorer
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Discover healthy food products
              </p>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoryFilter
            categories={allCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            loading={categoriesLoading}
          />
          <SortControl
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Active filters indicator */}
        {viewMode !== "home" && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {viewMode === "search" && `Search results for products`}
              {viewMode === "barcode" && `Barcode search result`}
              {viewMode === "category" && `Category: ${selectedCategory}`}
            </span>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <LoadingSpinner />}

        {/* Products grid */}
        {!isLoading && displayProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {displayProducts.map((product, index) => (
                <ProductCard
                  key={product._id || product.code || index}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>

            {/* Pagination - only show for home view */}
            {viewMode === "home" && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <span className="text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isLoading && displayProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No products found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>

      {/* Cache Manager */}
      <CacheManager />
    </div>
  );
}
