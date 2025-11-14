import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import axios from "@/lib/axios";

const getCachedProducts = unstable_cache(
  async (page: string) => {
    const response = await axios.get(`products.json?page=${page}`);
    return response.data;
  },
  ["products-list"],
  {
    revalidate: 300, // 5 minutes
    tags: ["products"],
  }
);

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page") || "1";
  try {
    const data = await getCachedProducts(page);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
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
