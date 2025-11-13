import { NextRequest } from "next/server";
import axios from "@/lib/axios";
export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page") || "1";
  try {
    const response = await axios.get(`products.json?page=${page}`);
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
