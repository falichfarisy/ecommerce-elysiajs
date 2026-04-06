import Stripe from "stripe";
import { Elysia, t } from "elysia";
import { db, orders } from "../../db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2026-03-25.dahlia",
});

export const paymentModule = new Elysia({ prefix: "/payment" })
	.use(authMiddleware)

	.post(
		"/create-payment-intent",
		async (context) => {
			const user = (context as any).user;
			if (!user) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const body = context.body as { orderId: number };
			const { orderId } = body;

			const order = await db.select().from(orders).where(eq(orders.id, orderId));
			if (!order[0] || order[0].userId !== user.id) {
				context.set.status = 404;
				return { success: false, message: "Order not found" };
			}

			if (order[0].status !== "pending") {
				context.set.status = 400;
				return { success: false, message: "Order is not pending payment" };
			}

			const paymentIntent = await stripe.paymentIntents.create({
				amount: Math.round(order[0].total * 100),
				currency: "idr",
				metadata: {
					orderId: String(orderId),
					userId: user.id,
				},
			});

			return {
				success: true,
				data: {
					clientSecret: paymentIntent.client_secret,
					paymentIntentId: paymentIntent.id,
				},
			};
		},
		{
			body: t.Object({
				orderId: t.Number(),
			}),
		},
	)

	.post(
		"/webhook",
		async ({ request, set }) => {
			const sig = request.headers.get("stripe-signature");
			const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

			if (!sig || !endpointSecret) {
				set.status = 400;
				return { success: false, message: "Missing signature or secret" };
			}

			let event: Stripe.Event;
			try {
				const body = await request.text();
				event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
			} catch (err: any) {
				set.status = 400;
				return { success: false, message: `Webhook Error: ${err.message}` };
			}

			switch (event.type) {
				case "payment_intent.succeeded": {
					const paymentIntent = event.data.object as Stripe.PaymentIntent;
					const orderId = Number(paymentIntent.metadata.orderId);

					await db
						.update(orders)
						.set({ status: "paid" })
						.where(eq(orders.id, orderId));
					break;
				}
				case "payment_intent.payment_failed": {
					const paymentIntent = event.data.object as Stripe.PaymentIntent;
					const orderId = Number(paymentIntent.metadata.orderId);

					await db
						.update(orders)
						.set({ status: "cancelled" })
						.where(eq(orders.id, orderId));
					break;
				}
			}

			return { success: true, message: "Webhook processed" };
		},
	)

	.get("/config", () => ({
		success: true,
		data: {
			publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
		},
	}));