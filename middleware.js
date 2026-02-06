import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/saved-cars(.*)",
  "/reservations(.*)",
  "/profile(.*)",
]);

const isArcjetConfigured = !!process.env.ARCJET_KEY;
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Create Arcjet middleware only if configured
let aj = null;
if (isArcjetConfigured) {
  aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      shield({
        mode: "LIVE",
      }),
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE",
        ],
      }),
    ],
  });
}

// Create base Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  if (!isClerkConfigured) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

// Export middleware based on configuration
let middleware;

if (isArcjetConfigured) {
  middleware = createMiddleware(aj, clerk);
} else {
  middleware = clerk;
}

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
