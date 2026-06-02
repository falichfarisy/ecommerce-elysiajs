import { Elysia, t } from "elysia";
import { authMiddleware } from "../auth";
import { db, carts, products, type NewCart } from "../../db";
import { eq, and } from "drizzle-orm";

export const cartModule = new Elysia({ prefix: "/cart" })
	.use(authMiddleware)

	.get("/", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const cartItems = await db
			.select({ cartId: carts.id, quantity: carts.quantity, product: products })
			.from(carts)
			.innerJoin(products, eq(carts.productId, products.id))
			.where(eq(carts.userId, user.id));

		return { success: true, data: cartItems };
	})

	.post(
		"/",
		async (context) => {
			const user = (context as any).user;
			if (!user) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const body = context.body as { productId: number; quantity?: number };
			const { productId, quantity = 1 } = body;

			const product = await db.select().from(products).where(eq(products.id, productId));
			if (!product[0]) {
				context.set.status = 404;
				return { success: false, message: "Product not found" };
			}

			const existing = await db
				.select()
				.from(carts)
				.where(and(eq(carts.userId, user.id), eq(carts.productId, productId)));

			if (existing[0]) {
				await db
					.update(carts)
					.set({ quantity: existing[0].quantity + quantity })
					.where(eq(carts.id, existing[0].id));
			} else {
				await db.insert(carts).values({
					userId: user.id,
					productId,
					quantity,
				} satisfies NewCart);
			}

			return { success: true, message: "Item added to cart" };
		},
		{
			body: t.Object({
				productId: t.Number(),
				quantity: t.Optional(t.Number()),
			}),
		},
	)

	.delete("/:id", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const params = context.params as { id: string };
		const cartItem = await db
			.select()
			.from(carts)
			.where(and(eq(carts.id, Number(params.id)), eq(carts.userId, user.id)));

		if (!cartItem[0]) {
			context.set.status = 404;
			return { success: false, message: "Cart item not found" };
		}

		await db.delete(carts).where(eq(carts.id, Number(params.id)));
		return { success: true, message: "Item removed from cart" };
	});
