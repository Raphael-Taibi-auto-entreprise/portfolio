import { PrismaClient } from "@prisma/client";
import  { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const urlString = process.env.DATABASE_URL;

if (!urlString) {
    throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({connectionString: String(urlString)});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({adapter: adapter});