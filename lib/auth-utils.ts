import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Centralized utility to check if the current user is an administrator.
 * Logic:
 * 1. Returns true if the user's email matches the ADMIN_EMAIL environment variable.
 * 2. Returns true in development environment to facilitate local testing.
 * 3. Returns true if the session user's role is "ADMIN".
 */
export async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // 1. Check for ADMIN_EMAIL env var as a fallback
  if (session?.user?.email && process.env.ADMIN_EMAIL === session.user.email) {
    return true;
  }
  
  // 2. Check for development mode
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // 3. Fallback to session role
  return session?.user?.role === "ADMIN";
}
