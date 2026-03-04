import Elysia, { status, t } from "elysia";
import { authMiddleware } from "../auth";
import { db, users } from "../../db";
import { eq } from "drizzle-orm";

export const profileModule = new Elysia({ prefix: "/profile" })
	.use(authMiddleware)

	// GET /profile - menampilkan data profile user
	.get("/", async ({ user }) => {
		const profileUser = await db.select().from(users).where(eq(users.id, user.userId));

		if (!profileUser[0]) {
			return { success: false, message: "User not found" };
		}

		return { success: true, data: profileUser[0] };
	})

	// PATCH /profile/:id - mengubah data profile user
	.patch(
		"/",
		async ({ user, body }) => {
			const allowedFields = ["username", "phone"] as const;
			const updateData: Record<string, string> = {};
			allowedFields.forEach((field) => {
				if ((body as any)[field] !== undefined) {
					updateData[field] = (body as any)[field];
				}
			});

			const response = await db
				.update(users)
				.set({ ...updateData, updatedAt: new Date() })
				.where(eq(users.id, user.userId))
				.returning();

			return { success: true, message: "Profile user success update" };
		},
		{
			body: t.Object({
				username: t.Optional(t.String()),
				phone: t.Optional(t.String()),
			}),
		},
	);
