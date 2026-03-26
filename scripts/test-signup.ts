import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function testSignup() {
  const testEmail = `test-${Date.now()}@example.com`;
  const testName = "Test User";
  const testPassword = "Password123!";

  console.log(`Attempting signup for ${testEmail}...`);

  try {
    // We simulate a request context if needed, but better-auth api calls usually work
    const result = await auth.api.signUpEmail({
        body: {
            email: testEmail,
            name: testName,
            password: testPassword,
        }
    });

    console.log("Signup result:", result);

    console.log("Waiting 2 seconds for persistence...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Now check if user exists in DB
    console.log("Checking DB for user with email:", testEmail);
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (user) {
      console.log("SUCCESS: User found in database:", user);
    } else {
      console.log("FAILURE: User NOT found in database after signup.");
    }
  } catch (error) {
    console.error("Error during signup check:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();
