require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"]
});

async function main() {
  console.log("Connecting to database using pg adapter and querying products...");
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    console.log("SUCCESS: Queried products!");
    console.log("Number of products:", products.length);
    if (products.length > 0) {
      console.log("First product sample:", JSON.stringify(products[0], null, 2));
    }
  } catch (error) {
    console.error("DATABASE QUERY ERROR:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
