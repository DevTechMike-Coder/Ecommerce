import { auth } from "./auth";
import { headers } from "next/headers";
import { prisma } from "./prisma";

/**
 * Centralized utility to check if the current user is an administrator.
 */
export async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (session?.user?.email && process.env.ADMIN_EMAIL === session.user.email) {
    return true;
  }
  
  return session?.user?.role === "ADMIN";
}


/**
 * Checks if any administrator exists in the database.
 */
export async function getAdminCount() {
  return await prisma.user.count({
    where: { role: "ADMIN" }
  });
}

/**
 * Retrieves the current session.
 */
export async function getUserSession() {
  return await auth.api.getSession({ headers: await headers() });
}

