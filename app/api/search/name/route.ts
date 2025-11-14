import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import axios from "@/lib/axios";

const getCachedSearchResults = unstable_cache(
  async (searchTerm: string) => {
    const response = await axios.get(
      `cgi/search.pl?search_terms=${searchTerm}&json=true`
    );
    return response.data;
  },
  ["search-name"],
  {
    revalidate: 300, // 5 minutes
    tags: ["search"],
  }
);

export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get("searchTerm") || "1";
  try {
    const data = await getCachedSearchResults(searchTerm);
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
