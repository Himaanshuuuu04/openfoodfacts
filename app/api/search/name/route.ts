import { NextRequest } from "next/server";
import axios from "@/lib/axios";
export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get("searchTerm") || "1";
  try {
    const response = await axios.get(
      `cgi/search.pl?search_terms=${searchTerm}&json=true`
    );
    return new Response(JSON.stringify(response.data), {
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
