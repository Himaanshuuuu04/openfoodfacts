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
      className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-200 dark:border-zinc-800 group"
    >
      <div className="relative h-48 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />
        {nutritionGrade !== "N/A" && (
          <div
            className={`absolute top-2 right-2 ${getNutritionGradeColor(
              nutritionGrade
            )} text-white font-bold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg`}
          >
            {nutritionGrade.toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2 min-h-14">
          {productName}
        </h3>

        {brand && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {brand}
          </p>
        )}

        {category && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
          {ingredients}
        </p>
      </div>
    </div>
  );
}
