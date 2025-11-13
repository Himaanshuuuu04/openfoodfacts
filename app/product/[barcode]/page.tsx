"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  fetchProductDetails,
  selectCurrentProduct,
  selectProductLoading,
  selectProductError,
  toggleFavorite,
  selectIsFavorite,
} from "@/store/slices/productSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft, Heart, AlertCircle } from "lucide-react";

const getNutritionGradeColor = (grade?: string) => {
  if (!grade) return "bg-gray-400";
  const g = grade.toLowerCase();
  switch (g) {
    case "a":
      return "bg-green-500";
    case "b":
      return "bg-lime-500";
    case "c":
      return "bg-yellow-500";
    case "d":
      return "bg-orange-500";
    case "e":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const barcode = params.barcode as string;

  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const isFavorite = useSelector(selectIsFavorite(barcode));

  useEffect(() => {
    if (barcode) {
      dispatch(fetchProductDetails(barcode));
    }
  }, [barcode, dispatch]);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(barcode));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                Product not found
              </h3>
              <p className="text-red-700 dark:text-red-300">
                {error || "Unable to load product details"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nutritionGrade =
    product.nutrition_grades_tags?.[0]?.replace("en:", "") ||
    product.nutriscore_grade ||
    "N/A";
  const imageUrl =
    product.image_front_url || product.image_url || "/placeholder-product.png";
  const productName = product.product_name || "Unknown Product";
  const brands = product.brands || "Unknown Brand";
  const categories =
    product.categories_tags?.map((c) => c.replace("en:", "")).join(", ") ||
    product.categories ||
    "N/A";
  const ingredients =
    product.ingredients_text || "No ingredients information available";
  const nutriments = product.nutriments || {};
  const labels =
    product.labels_tags?.map((l) => l.replace("en:", "")).join(", ") ||
    product.labels ||
    "None";
  const allergens =
    product.allergens_tags?.map((a) => a.replace("en:", "")).join(", ") ||
    product.allergens ||
    "None";
  const stores = product.stores || "N/A";
  const countries =
    product.countries_tags?.map((c) => c.replace("en:", "")).join(", ") ||
    product.countries ||
    "N/A";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
          {/* Product Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={productName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-product.png";
                  }}
                />
              </div>
              {nutritionGrade !== "N/A" && (
                <div
                  className={`absolute top-4 right-4 ${getNutritionGradeColor(
                    nutritionGrade
                  )} text-white font-bold w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg`}
                >
                  {nutritionGrade.toUpperCase()}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {productName}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {brands}
              </p>

              <div className="space-y-3 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Categories
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {categories}
                  </p>
                </div>

                {product.code && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Barcode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-mono">
                      {product.code}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Stores
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{stores}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Countries
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {countries}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="border-t border-gray-200 dark:border-zinc-800 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ingredients
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {ingredients}
                </p>
              </div>

              {/* Nutrition Facts */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Nutritional Values (per 100g)
                </h2>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                  <div className="space-y-2">
                    {nutriments.energy && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Energy
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.energy} kJ
                        </span>
                      </div>
                    )}
                    {nutriments["energy-kcal"] && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Energy (kcal)
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments["energy-kcal"]} kcal
                        </span>
                      </div>
                    )}
                    {nutriments.fat !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Fat
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.fat} g
                        </span>
                      </div>
                    )}
                    {nutriments["saturated-fat"] !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Saturated Fat
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments["saturated-fat"]} g
                        </span>
                      </div>
                    )}
                    {nutriments.carbohydrates !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Carbohydrates
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.carbohydrates} g
                        </span>
                      </div>
                    )}
                    {nutriments.sugars !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Sugars
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.sugars} g
                        </span>
                      </div>
                    )}
                    {nutriments.fiber !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Fiber
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.fiber} g
                        </span>
                      </div>
                    )}
                    {nutriments.proteins !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Proteins
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.proteins} g
                        </span>
                      </div>
                    )}
                    {nutriments.salt !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Salt
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.salt} g
                        </span>
                      </div>
                    )}
                    {nutriments.sodium !== undefined && (
                      <div className="flex justify-between py-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Sodium
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {nutriments.sodium} g
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Labels and Allergens */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Labels
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {labels.split(",").map((label, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                        >
                          {label.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Allergens
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {allergens.split(",").map((allergen, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm"
                        >
                          {allergen.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          {(product.image_ingredients_url || product.image_nutrition_url) && (
            <div className="border-t border-gray-200 dark:border-zinc-800 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Additional Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.image_ingredients_url && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Ingredients Label
                    </h3>
                    <img
                      src={product.image_ingredients_url}
                      alt="Ingredients"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-700"
                    />
                  </div>
                )}
                {product.image_nutrition_url && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nutrition Facts
                    </h3>
                    <img
                      src={product.image_nutrition_url}
                      alt="Nutrition"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
