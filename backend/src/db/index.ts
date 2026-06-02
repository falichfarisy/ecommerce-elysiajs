import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ecommerce";

const pool = postgres(connectionString);

export const db = drizzle(pool, { schema });
export * from "./schema";
