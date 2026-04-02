import { Elysia, t } from "elysia";
import { db } from "../../db";
import { sql, eq, and } from "drizzle-orm";
import { authMiddleware } from "../auth";
import { products } from "../../db/schema";

const reviews = db.schema("reviews");
const reviewSchema = {
	id: t.Number(),
	productId: t.Number(),
	userId: t.String(),
	rating: t.Number(),
	comment: t.Optional(t.String()),
	createdAt: t.Date(),
};

export const reviewModule = new Elysia({ prefix: "/reviews" })
	.use(authMiddleware)

	.get("/product/:productId", async ({ params, set }) => {
		const productId = Number(params.productId);
		const reviewsData = await db.execute(
			sql`SELECT * FROM reviews WHERE product_id = ${productId} ORDER BY created_at DESC`
		);

		if (!reviewsData.length) {
			set.status = 404;
			return { success: false, message: "No reviews found" };
		}

		const avgRating = await db.execute(
			sql`SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ${productId}`
		);

		return {
			success: true,
			data: {
				reviews: reviewsData,
				averageRating: Number(avgRating[0]?.avg || 0).toFixed(1),
				totalReviews: Number(avgRating[0]?.count || 0),
			},
		};
	})

	.post(
		"/",
		async (context) => {
			const user = (context as any).user;
			if (!user) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const { productId, rating, comment } = context.body as {
				productId: number;
				rating: number;
				comment?: string;
			};

			if (rating < 1 || rating > 5) {
				context.set.status = 400;
				return { success: false, message: "Rating must be between 1 and 5" };
			}

			const result = await db.execute(
				sql`INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
					VALUES (${productId}, ${user.id}, ${rating}, ${comment || null}, NOW())
					RETURNING *`
			);

			return { success: true, data: result[0] };
		},
		{
			body: t.Object({
				productId: t.Number(),
				rating: t.Number({ minimum: 1, maximum: 5 }),
				comment: t.Optional(t.String()),
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
		const reviewId = Number(params.id);

		const existing = await db.execute(
			sql`SELECT * FROM reviews WHERE id = ${reviewId} AND user_id = ${user.id}`
		);

		if (!existing.length) {
			context.set.status = 404;
			return { success: false, message: "Review not found" };
		}

		await db.execute(sql`DELETE FROM reviews WHERE id = ${reviewId}`);
		return { success: true, message: "Review deleted" };
	});