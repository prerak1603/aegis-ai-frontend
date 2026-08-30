import { NextResponse } from "next/server";
import { getUserApiKey } from "@/lib/getUserApiKey";

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";

export async function GET() {
  const keyLookup = await getUserApiKey();
  if (!keyLookup.ok) {
    return NextResponse.json({ error: keyLookup.error }, { status: keyLookup.status });
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}/billing/status`, {
      headers: { "X-API-Key": keyLookup.apiKey },
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the billing service. Try again in a moment." },
      { status: 502 }
    );
  }
}
