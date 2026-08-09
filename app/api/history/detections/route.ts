import { NextRequest, NextResponse } from "next/server";
import { getUserApiKey } from "@/lib/getUserApiKey";

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";

export async function GET(req: NextRequest) {
  const keyLookup = await getUserApiKey();
  if (!keyLookup.ok) {
    return NextResponse.json({ error: keyLookup.error }, { status: keyLookup.status });
  }

  const uploadId = req.nextUrl.searchParams.get("upload_id");
  const limit = req.nextUrl.searchParams.get("limit") ?? "100";

  const qs = new URLSearchParams({ limit });
  if (uploadId) qs.set("upload_id", uploadId);

  try {
    const upstream = await fetch(`${API_BASE_URL}/history/detections?${qs.toString()}`, {
      headers: { "X-API-Key": keyLookup.apiKey },
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the analysis engine." },
      { status: 502 }
    );
  }
}
