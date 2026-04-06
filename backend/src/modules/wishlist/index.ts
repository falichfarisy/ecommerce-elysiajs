import { Elysia, t } from "elysia";
import { db, wishlists, products } from "../../db";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "../auth";

export const wishlistModule = new Elysia({ prefix: "/wishlist" })
	.use(authMiddleware)

	.get("/", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const items = await db
			.select({ wishlist: wishlists, product: products })
			.from(wishlists)
			.innerJoin(products, eq(wishlists.productId, products.id))
			.where(eq(wishlists.userId, user.id));

		return { success: true, data: items };
	})

	.post(
		"/",
		async (context) => {
			const user = (context as any).user;
			if (!user) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const { productId } = context.body as { productId: number };

			const product = await db.select().from(products).where(eq(products.id, productId));
			if (!product[0]) {
				context.set.status = 404;
				return { success: false, message: "Product not found" };
			}

			const existing = await db
				.select()
				.from(wishlists)
				.where(and(eq(wishlists.userId, user.id), eq(wishlists.productId, productId)));

			if (existing[0]) {
				context.set.status = 400;
				return { success: false, message: "Product already in wishlist" };
			}

			await db.insert(wishlists).values({
				userId: user.id,
				productId,
			} as any);

			return { success: true, message: "Added to wishlist" };
		},
		{
			body: t.Object({
				productId: t.Number(),
			}),
		},
	)

	.delete("/:productId", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const params = context.params as { productId: string };
		const productId = Number(params.productId);

		const existing = await db
			.select()
			.from(wishlists)
			.where(and(eq(wishlists.userId, user.id), eq(wishlists.productId, productId)));

		if (!existing[0]) {
			context.set.status = 404;
			return { success: false, message: "Item not in wishlist" };
		}

		await db
			.delete(wishlists)
			.where(and(eq(wishlists.userId, user.id), eq(wishlists.productId, productId)));

		return { success: true, message: "Removed from wishlist" };
	});