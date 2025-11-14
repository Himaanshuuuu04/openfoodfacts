import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import axios from "@/lib/axios";

const getCachedProductByBarcode = unstable_cache(
  async (barcode: string) => {
    const response = await axios.get(`api/v0/product/${barcode}.json`);
    return response.data;
  },
  ["barcode-search"],
  {
    revalidate: 900, // 15 minutes
    tags: ["product", "barcode"],
  }
);

export async function GET(request: NextRequest) {
  const barcode = request.nextUrl.searchParams.get("barcode") || "1";
  try {
    const data = await getCachedProductByBarcode(barcode);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
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
