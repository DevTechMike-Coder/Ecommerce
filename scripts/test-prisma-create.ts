import "dotenv/config";
import { prisma } from "../lib/prisma";

async function testPrismaCreate() {
  const testEmail = `prisma-test-${Date.now()}@example.com`;
  console.log(`Attempting direct Prisma create for ${testEmail}...`);

  try {
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Prisma Test User",
      }
    });

    console.log("Prisma create result:", newUser);

    const checkUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (checkUser) {
      console.log("SUCCESS: User found in database after direct Prisma create.");
    } else {
      console.log("FAILURE: User NOT found in database after direct Prisma create.");
    }
  } catch (error) {
    console.error("Error during direct Prisma create:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaCreate();
