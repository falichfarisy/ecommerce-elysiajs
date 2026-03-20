import { Elysia, t } from "elysia";
import { auth } from "../../auth/auth";
import { db, user, userProfile } from "../../db";
import { eq } from "drizzle-orm";

const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

const betterAuthHandler = async ({ request, set }: { request: Request; set: any }) => {
	if (!BETTER_AUTH_ACCEPT_METHODS.includes(request.method)) {
		set.status = 405;
		return { success: false, message: "Method not allowed" };
	}
	return auth.handler(request);
};

export const authMiddleware = new Elysia({ name: "better-auth-middleware" })
	.mount(auth.handler)
	.derive(async ({ request, set }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) {
			set.status = 401;
			return {
				user: null,
				session: null,
			};
		}

		return {
			user: session.user,
			session: session.session,
		};
	});

export const authModule = new Elysia({ prefix: "/api/auth" })
	.use(authMiddleware)
	.all("/*", betterAuthHandler, {
		beforeHandle: ({ request }) => {
			if (!BETTER_AUTH_ACCEPT_METHODS.includes(request.method)) {
				return;
			}
		},
	})
	.post(
		"/register",
		async ({ body, set }) => {
			const { email, password, username } = body as {
				email: string;
				password: string;
				username: string;
			};

			const existingUser = await db.select().from(user).where(eq(user.email, email));
			if (existingUser[0]) {
				set.status = 400;
				return { success: false, message: "Email already registered" };
			}

			const userData = await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: username,
				},
			});

			if (userData.user) {
				await db.insert(userProfile).values({
					userId: userData.user.id,
					username,
				});
			}

			return { success: true, data: userData };
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 6 }),
				username: t.String({ minLength: 2 }),
			}),
		},
	);
