import { NextRequest, NextResponse } from "next/server";
import { getUserApiKey } from "@/lib/getUserApiKey";

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";

/**
 * Creates a checkout (whichever gateway the backend is currently wired to)
 * for the signed-in user and hands back its URL for the browser to
 * redirect to. No gateway credential ever touches this route (or Vercel
 * at all) — the backend owns billing entirely and this is a thin,
 * API-key-authenticated proxy, same shape as app/api/analyze/route.ts.
 */
export async function POST(req: NextRequest) {
  const keyLookup = await getUserApiKey();
  if (!keyLookup.ok) {
    return NextResponse.json({ error: keyLookup.error }, { status: keyLookup.status });
  }

  const body = await req.json().catch(() => null);
  const tier = body?.tier;
  if (tier !== "starter" && tier !== "pro") {
    return NextResponse.json({ error: "tier must be 'starter' or 'pro'." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}/billing/checkout-session`, {
      method: "POST",
      headers: {
        "X-API-Key": keyLookup.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tier }),
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
