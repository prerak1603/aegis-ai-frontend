import { NextRequest, NextResponse } from "next/server";

// Vercel function timeout — /analyze can take 20-90s depending on file
// size and whether Render's free instance just woke from a cold start.
// Raise this if your Vercel plan allows more; verify the current cap
// for your plan in Vercel's docs.
export const maxDuration = 60;

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";
const API_KEY = process.env.AEGIS_API_KEY;

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: AEGIS_API_KEY is not set." },
      { status: 500 }
    );
  }

  const incomingForm = await req.formData();
  const file = incomingForm.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const outgoingForm = new FormData();
  outgoingForm.append("file", file, file.name);

  try {
    const upstream = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "X-API-Key": API_KEY },
      body: outgoingForm,
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not reach the analysis engine. It may be waking up — try again in a moment." },
      { status: 502 }
    );
  }
}
