import "dotenv/config";
import { prisma } from "../lib/prisma";

console.log("Using DATABASE_URL:", process.env.DATABASE_URL?.split('@')[1]); // Log host only for security

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users in the database.`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.id})`);
    });
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
