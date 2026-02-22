import { Elysia, t } from "elysia";
import { authMiddleware } from "../auth";
import { db, carts, products } from "../../db";
import { eq, and } from "drizzle-orm";

export const cartModule = new Elysia({ prefix: "/cart" })
	.use(authMiddleware)

	// GET /cart - lihat cart user
	.get("/", async ({ user }) => {
		const cartItems = await db
			.select({ cartId: carts.id, quantity: carts.quantity, product: products })
			.from(carts)
			.innerJoin(products, eq(carts.productId, products.id))
			.where(eq(carts.userId, user.userId));

		return { success: true, data: cartItems };
	})

	// POST /cart - Tambah item ke cart
	.post(
		"/",
		async ({ user, body, set }) => {
			const { productId, quantity = 1 } = body as {
				productId: number;
				quantity?: number;
			};

			const product = await db.select().from(products).where(eq(products.id, productId));
			if (!product[0]) {
				set.status = 404;
				return { success: false, message: "Product not found" };
			}

			const existing = await db
				.select()
				.from(carts)
				.where(and(eq(carts.userId, user.userId), eq(carts.productId, productId)));

			if (existing[0]) {
				await db
					.update(carts)
					.set({ quantity: existing[0].quantity + quantity })
					.where(eq(carts.id, existing[0].id));
			} else {
				await db.insert(carts).values({
					userId: user.userId,
					productId,
					quantity,
				});
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

	// DELETE /cart/:id - Hapus dari cart
	.delete("/:id", async ({ user, params, set }) => {
		const cartItem = await db
			.select()
			.from(carts)
			.where(and(eq(carts.id, Number(params.id)), eq(carts.userId, user.userId)));

		if (!cartItem[0]) {
			set.status = 404;
			return { success: false, message: "Cart item not found" };
		}

		await db.delete(carts).where(eq(carts.id, Number(params.id)));
		return { success: true, message: "Item removed from cart" };
	});
