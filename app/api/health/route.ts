import { NextResponse } from "next/server";

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";

export async function GET() {
  const start = Date.now();
  try {
    const upstream = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data = await upstream.json();
    return NextResponse.json({ ...data, response_ms: Date.now() - start });
  } catch {
    return NextResponse.json(
      { status: "unhealthy", response_ms: Date.now() - start },
      { status: 200 }
    );
  }
}
