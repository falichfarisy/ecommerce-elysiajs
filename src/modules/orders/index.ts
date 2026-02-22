import { Elysia, t } from "elysia";
import { db, orders, orderItems, carts, products } from "../../db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../auth";

export const ordersModule = new Elysia({ prefix: "/orders" })
	.use(authMiddleware)

	// GET /orders - List orders user
	.get("/", async ({ user }) => {
		const userOrders = await db.select().from(orders).where(eq(orders.userId, user.userId));
		return { success: true, data: userOrders };
	})

	// POST /orders - Buat oder dari cart
	.post("/", async ({ user, body, set }) => {
		const { shippingAddress, phone, notes } = body as any;

		const cartItems = await db
			.select({ cartId: carts.id, productId: carts.productId, quantity: carts.quantity, price: products.price })
			.from(carts)
			.innerJoin(products, eq(carts.productId, products.id))
			.where(eq(carts.userId, user.userId));

		if (cartItems.length == 0) {
			set.status = 400;
			return { success: false, message: "Cart is empty" };
		}

		const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

		const order = await db
			.insert(orders)
			.values({
				userId: user.userId,
				total,
				shippingAddress: shippingAddress,
				phone: phone,
				notes: notes,
			})
			.returning();

		for (const item of cartItems) {
			await db.insert(orderItems).values({
				orderId: order[0].id,
				productId: item.productId,
				quantity: item.quantity,
				price: item.price,
			});
			await db.delete(carts).where(eq(carts.id, item.cartId));
		}

		return { success: true, data: order[0] };
	})

	// GET /orders/:id - Detail order
	.get("/:id", async ({ user, params, set }) => {
		const order = await db
			.select()
			.from(orders)
			.where(eq(orders.id, Number(params.id)));

		if (!order[0] || order[0].userId !== user.userId) {
			set.status = 404;
			return { success: false, message: "Order not Found" };
		}

		const item = await db.select().from(orderItems).where(eq(orderItems.orderId, order[0].id));

		return { success: true, data: { order: order[0], item } };
	});
