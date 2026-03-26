import { prisma } from "../lib/prisma";

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    console.log("Current Users in DB:");
    console.table(users);
    
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" }
    });
    console.log(`Total Admins: ${adminCount}`);
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
