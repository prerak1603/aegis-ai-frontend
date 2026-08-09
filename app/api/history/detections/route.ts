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

  const uploadId = req.nextUrl.searchParams.get("upload_id");
  const limit = req.nextUrl.searchParams.get("limit") ?? "100";

  const qs = new URLSearchParams({ limit });
  if (uploadId) qs.set("upload_id", uploadId);

  try {
    const upstream = await fetch(`${API_BASE_URL}/history/detections?${qs.toString()}`, {
      headers: { "X-API-Key": API_KEY },
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
