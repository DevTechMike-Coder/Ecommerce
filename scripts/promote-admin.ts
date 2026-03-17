import { prisma } from "../lib/prisma";

async function promoteToAdmin(email: string) {
  if (!email) {
    console.error("Please provide an email address.");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log(`Successfully promoted user ${user.email} to ADMIN.`);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
promoteToAdmin(email);
