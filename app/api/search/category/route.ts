import { NextRequest } from "next/server";
import axios from "@/lib/axios";
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") || "1";
  const sortBy = request.nextUrl.searchParams.get("sortBy") || "unique_scans_n";
  const order = request.nextUrl.searchParams.get("order") || "asc";
  try {
    const response = await axios.get(`category/${category}.json`);
    let products = response.data.products || [];

    // Sorting logic
    if (sortBy === "name") {
      products.sort((a: any, b: any) => {
        const aName = a.product_name || "";
        const bName = b.product_name || "";
        return order === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
    } else if (sortBy === "nutrition_grade") {
      const orderMap = ["a", "b", "c", "d", "e"];
      products.sort((a: any, b: any) => {
        const aGrade = a.nutrition_grades_tags?.[0] || "e";
        const bGrade = b.nutrition_grades_tags?.[0] || "e";
        return order === "asc"
          ? orderMap.indexOf(aGrade) - orderMap.indexOf(bGrade)
          : orderMap.indexOf(bGrade) - orderMap.indexOf(aGrade);
      });
    } else if (sortBy === "unique_scans_n") {
      products.sort((a: any, b: any) => {
        const aScans = a.unique_scans_n || 0;
        const bScans = b.unique_scans_n || 0;
        return order === "asc" ? aScans - bScans : bScans - aScans;
      });
    }

    return new Response(JSON.stringify({ ...response.data, products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch product data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
