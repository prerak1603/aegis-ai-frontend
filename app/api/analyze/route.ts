import { NextRequest, NextResponse } from "next/server";
import { getUserApiKey } from "@/lib/getUserApiKey";

export const maxDuration = 60;

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";

export async function POST(req: NextRequest) {
  const keyLookup = await getUserApiKey();
  if (!keyLookup.ok) {
    return NextResponse.json({ error: keyLookup.error }, { status: keyLookup.status });
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
      headers: { "X-API-Key": keyLookup.apiKey },
      body: outgoingForm,
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the analysis engine. It may be waking up — try again in a moment." },
      { status: 502 }
    );
  }
}
