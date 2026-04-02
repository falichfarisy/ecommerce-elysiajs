import { Elysia, t } from "elysia";
import { db, userProfile, user } from "../../db";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "../auth";

export type Role = "customer" | "admin" | "staff";

const rolePermissions: Record<Role, string[]> = {
	customer: ["read:products", "read:own_orders", "create:orders", "manage:cart"],
	staff: [
		"read:products",
		"update:products",
		"read:orders",
		"update:orders",
		"read:customers",
	],
	admin: [
		"read:products",
		"create:products",
		"update:products",
		"delete:products",
		"read:orders",
		"update:orders",
		"delete:orders",
		"read:customers",
		"manage:users",
		"manage:roles",
	],
};

export function hasPermission(role: Role, permission: string): boolean {
	return rolePermissions[role]?.includes(permission) || false;
}

export async function getUserRole(userId: string): Promise<Role> {
	const profile = await db
		.select()
		.from(userProfile)
		.where(eq(userProfile.userId, userId));
	return (profile[0]?.role as Role) || "customer";
}

export const rbacModule = new Elysia({ prefix: "/rbac" })
	.use(authMiddleware)

	.get("/permissions", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const role = await getUserRole(user.id);
		return {
			success: true,
			data: {
				role,
				permissions: rolePermissions[role],
			},
		};
	})

	.get("/users", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const role = await getUserRole(user.id);
		if (!hasPermission(role, "manage:users")) {
			context.set.status = 403;
			return { success: false, message: "Forbidden" };
		}

		const users = await db.select({
			id: user.id,
			name: user.name,
			email: user.email,
			role: userProfile.role,
		}).from(user).innerJoin(userProfile, eq(user.id, userProfile.userId));

		return { success: true, data: users };
	})

	.patch(
		"/users/:userId/role",
		async (context) => {
			const user = (context as any).user;
			if (!user) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const adminRole = await getUserRole(user.id);
			if (!hasPermission(adminRole, "manage:roles")) {
				context.set.status = 403;
				return { success: false, message: "Forbidden" };
			}

			const params = context.params as { userId: string };
			const body = context.body as { role: Role };

			await db
				.update(userProfile)
				.set({ role: body.role })
				.where(eq(userProfile.userId, params.userId));

			return { success: true, message: "Role updated" };
		},
		{
			body: t.Object({
				role: t.Union([t.Literal("customer"), t.Literal("admin"), t.Literal("staff")]),
			}),
		},
	);