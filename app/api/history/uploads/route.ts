import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";
const API_KEY = process.env.AEGIS_API_KEY;

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: AEGIS_API_KEY is not set." },
      { status: 500 }
    );
  }

  const limit = req.nextUrl.searchParams.get("limit") ?? "50";

  try {
    const upstream = await fetch(
      `${API_BASE_URL}/history/uploads?limit=${encodeURIComponent(limit)}`,
      {
        headers: { "X-API-Key": API_KEY },
        cache: "no-store",
      }
    );
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the analysis engine." },
      { status: 502 }
    );
  }
}
