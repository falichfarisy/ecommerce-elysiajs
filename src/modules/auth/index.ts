import { Elysia, t } from "elysia";
import { db, users } from "../../db";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcrypt";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

export const authModule = new Elysia({ prefix: "/api/auth" })
  // POST /auth/register
	.post("/register", async ({ body, set }) => {
		// POST /auth/register
		const { email, password, username } = body as { email: string; password: string; username: string };

		const existing = await db.select().from(users).where(eq(users.email, email));
		if (existing[0]) {
			set.status = 400;
			return { success: false, message: "Email already registered" };
		}

		const hashedPassword = await hash(password, 10);
		const result = await db.insert(users).values({ email, password: hashedPassword, username }).returning();

		const token = await new SignJWT({ userId: result[0].id, role: result[0].role })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("7d")
			.sign(JWT_SECRET);

		return { success: true, data: { user: result[0], token } };
	})
	.post(
		"/login",
		async ({ body, set }) => {
			const { email, password } = body as { email: string; password: string };

			const user = await db.select().from(users).where(eq(users.email, email));
			if (!user[0]) {
				set.status = 401;
				return { success: false, message: "Invalid credentials" };
			}

			const isValid = await compare(password, user[0].password);
			if (!isValid) {
				set.status = 401;
				return { success: false, message: "Invalid credentials" };
			}

			const token = await new SignJWT({ userId: user[0].id, role: user[0].role })
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("7d")
				.sign(JWT_SECRET);
			return { success: true, data: { user: user[0], token } };
		},
		{
			body: t.Object({
				email: t.String(),
				password: t.String(),
			}),
		},
	);

export const authMiddleware = new Elysia({ name: "auth" }).derive(
	{ as: "scoped" },
	async ({ headers, status }) => {
		const authHeader = headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			return status(401, { success: false, message: "Unauthorized" });
		}

		const token = authHeader.slice(7);
		try {
			const { payload } = await jwtVerify(token, JWT_SECRET);
			return {
				user: payload as {
					userId: number;
					role: string;
				},
			};
		} catch {
			return status(401, { success: false, message: "Invalid token" });
		}
	},
);
