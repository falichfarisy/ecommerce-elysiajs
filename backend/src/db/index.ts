import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ecommerce";

const pool = postgres(connectionString, {
	max: 20, // Connection pooling - adjust based on expected load
	idle_timeout: 20,
	connect_timeout: 10,
});

export const db = drizzle(pool, { schema });
export * from "./schema";