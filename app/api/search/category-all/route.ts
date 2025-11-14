import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import axios from "@/lib/axios";

const getCachedCategories = unstable_cache(
  async () => {
    const response = await axios.get(`categories.json`);
    return response.data;
  },
  ["all-categories"],
  {
    revalidate: 3600, // 1 hour
    tags: ["categories"],
  }
);

export async function GET(request: NextRequest) {
  try {
    const data = await getCachedCategories();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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
