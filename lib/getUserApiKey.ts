import { auth, clerkClient } from "@clerk/nextjs/server";

export type ApiKeyLookup =
  | { ok: true; apiKey: string }
  | { ok: false; status: 401 | 202; error: string };

/**
 * Resolves the Aegis API key for whoever is currently logged in via Clerk.
 *
 * Each signed-up user gets their own backend Customer + API key, created by
 * the /webhooks/clerk endpoint on sign-up and stored in Clerk's *private*
 * user metadata (never exposed to the browser — only readable here, in a
 * server-side route handler, using the Clerk secret key).
 *
 * Returns a 202 case (not 401) if the user is authenticated but the webhook
 * hasn't finished provisioning their account yet — this is a real possible
 * race right after signup, and it deserves a "try again in a moment"
 * message rather than looking like an auth failure.
 */
export async function getUserApiKey(): Promise<ApiKeyLookup> {
  const { userId } = await auth();

  if (!userId) {
    return { ok: false, status: 401, error: "Not signed in." };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const apiKey = user.privateMetadata?.aegis_api_key as string | undefined;

  if (!apiKey) {
    return {
      ok: false,
      status: 202,
      error: "Your account is still being set up — try again in a few seconds.",
    };
  }

  return { ok: true, apiKey };
}
