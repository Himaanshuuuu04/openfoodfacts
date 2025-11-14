import React from "react";

interface Product {
  _id?: string;
  code?: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  nutrition_grades_tags?: string[];
  ingredients_text?: string;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

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

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const nutritionGrade =
    product.nutrition_grades_tags?.[0]?.replace("en:", "") || "N/A";
  const imageUrl = product.image_url || "/placeholder-product.png";
  const productName = product.product_name || "Unknown Product";
  const brand = product.brands || "";
  const category = product.categories?.split(",")[0] || "";
  const ingredients = product.ingredients_text
    ? product.ingredients_text.substring(0, 100) +
      (product.ingredients_text.length > 100 ? "..." : "")
    : "No ingredients available";

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 dark:border-zinc-800 group hover:border-blue-400 dark:hover:border-blue-600 transform hover:-translate-y-1"
    >
      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />
        {nutritionGrade !== "N/A" && (
          <div
            className={`absolute top-3 right-3 ${getNutritionGradeColor(
              nutritionGrade
            )} text-white font-bold w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-xl ring-4 ring-white dark:ring-zinc-900 group-hover:scale-110 transition-transform duration-300`}
          >
            {nutritionGrade.toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-14 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {productName}
        </h3>

        {brand && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            {brand}
          </p>
        )}

        {category && (
          <div className="mb-3">
            <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
              {category}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed">
          {ingredients}
        </p>
      </div>
    </div>
  );
}
