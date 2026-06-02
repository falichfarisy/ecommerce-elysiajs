import { Elysia, t } from "elysia";
import { db, orders, orderItems, carts, products, user } from "../../db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../auth";
import { deductStock } from "../inventory";
import { sendEmail, emailTemplates } from "../email";

export const ordersModule = new Elysia({ prefix: "/orders" })
	.use(authMiddleware)

	.get("/", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id));
		return { success: true, data: userOrders };
	})

	.post(
		"/",
		async (context) => {
			const user = (context as any).user;
			if (!user) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const body = context.body as { shippingAddress: string; phone: string; notes?: string };
			const { shippingAddress, phone, notes } = body;

			const cartItems = await db
				.select({ cartId: carts.id, productId: carts.productId, quantity: carts.quantity, price: products.price })
				.from(carts)
				.innerJoin(products, eq(carts.productId, products.id))
				.where(eq(carts.userId, user.id));

			if (cartItems.length === 0) {
				context.set.status = 400;
				return { success: false, message: "Cart is empty" };
			}

			const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

		// Pre-check stock availability for all items
			for (const item of cartItems) {
				const product = await db.select().from(products).where(eq(products.id, item.productId));
				if (!product[0] || product[0].stock < item.quantity) {
					context.set.status = 400;
					return { success: false, message: `Insufficient stock for product ID ${item.productId}` };
				}
			}

		const order = await db
			.insert(orders)
			.values({
				userId: user.id,
				total,
				shippingAddress,
				phone,
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
			await deductStock(item.productId, item.quantity);
			await db.delete(carts).where(eq(carts.id, item.cartId));
		}

		// Send order confirmation email
		try {
			const itemsList = cartItems.map(
				(i) => `Product #${i.productId} x${i.quantity} - Rp ${(i.price * i.quantity).toLocaleString("id-ID")}`
			);
			const { subject, html } = emailTemplates.orderConfirmation(order[0].id, order[0].total, itemsList);
			await sendEmail({ to: user.email, subject, html });
		} catch (emailErr) {
			console.error("Failed to send order email:", emailErr);
			// Don't fail the order if email fails
		}

			return { success: true, data: order[0] };
		},
		{
			body: t.Object({
				shippingAddress: t.String(),
				phone: t.String(),
				notes: t.Optional(t.String()),
			}),
		},
	)

	.get("/:id", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const params = context.params as { id: string };
		const order = await db
			.select()
			.from(orders)
			.where(eq(orders.id, Number(params.id)));

		if (!order[0] || order[0].userId !== user.id) {
			context.set.status = 404;
			return { success: false, message: "Order not Found" };
		}

		const item = await db.select().from(orderItems).where(eq(orderItems.orderId, order[0].id));

		return { success: true, data: { order: order[0], item } };
	});
