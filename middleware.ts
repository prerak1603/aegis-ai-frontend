import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// /audit and /history require a signed-in user. Everything else — the
// landing page, sign-in/sign-up pages, and the API routes themselves
// (which check auth their own way) — stays public.
const isProtectedRoute = createRouteMatcher([
  "/audit(.*)",
  "/history(.*)",
  "/account(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
