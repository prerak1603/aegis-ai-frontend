import { NextRequest, NextResponse } from "next/server";
import { getUserApiKey } from "@/lib/getUserApiKey";

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";

export async function GET(req: NextRequest) {
  const keyLookup = await getUserApiKey();
  if (!keyLookup.ok) {
    return NextResponse.json({ error: keyLookup.error }, { status: keyLookup.status });
  }

  const limit = req.nextUrl.searchParams.get("limit") ?? "50";

  try {
    const upstream = await fetch(
      `${API_BASE_URL}/history/uploads?limit=${encodeURIComponent(limit)}`,
      {
        headers: { "X-API-Key": keyLookup.apiKey },
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
