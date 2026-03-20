import Elysia, { t } from "elysia";
import { authMiddleware } from "../auth";
import { db, user, userProfile } from "../../db";
import { eq } from "drizzle-orm";

export const profileModule = new Elysia({ prefix: "/profile" })
	.use(authMiddleware)

	.get("/", async (context) => {
		const authUser = (context as any).user;
		if (!authUser) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const profileUser = await db.select().from(user).where(eq(user.id, authUser.id));

		if (!profileUser[0]) {
			return { success: false, message: "User not found" };
		}

		const profile = await db.select().from(userProfile).where(eq(userProfile.userId, authUser.id));

		return {
			success: true,
			data: {
				...profileUser[0],
				...(profile[0] || {}),
			},
		};
	})

	.patch(
		"/",
		async (context) => {
			const authUser = (context as any).user;
			if (!authUser) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const body = context.body as { username?: string; phone?: string };

			if (body.username) {
				await db
					.update(userProfile)
					.set({ username: body.username })
					.where(eq(userProfile.userId, authUser.id));
			}

			if (body.phone) {
				await db
					.update(userProfile)
					.set({ phone: body.phone })
					.where(eq(userProfile.userId, authUser.id));
			}

			return { success: true, message: "Profile updated successfully" };
		},
		{
			body: t.Object({
				username: t.Optional(t.String()),
				phone: t.Optional(t.String()),
			}),
		},
	);
