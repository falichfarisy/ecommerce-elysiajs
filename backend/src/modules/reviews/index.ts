import { Elysia, t } from "elysia";
import { db, reviews, user } from "../../db";
import { eq, desc, sql } from "drizzle-orm";
import { authMiddleware } from "../auth";

export const reviewModule = new Elysia({ prefix: "/reviews" })
	.use(authMiddleware)

	.get("/product/:productId", async ({ params, set }) => {
		const productId = Number(params.productId);
		const reviewsData = await db
			.select({
				id: reviews.id,
				productId: reviews.productId,
				userId: reviews.userId,
				userName: user.name,
				rating: reviews.rating,
				comment: reviews.comment,
				createdAt: reviews.createdAt,
			})
			.from(reviews)
			.innerJoin(user, eq(reviews.userId, user.id))
			.where(eq(reviews.productId, productId))
			.orderBy(desc(reviews.createdAt));

		if (!reviewsData.length) {
			set.status = 404;
			return { success: false, message: "No reviews found" };
		}

		const avgResult = await db
			.select({ avg: sql<number>`avg(${reviews.rating})` })
			.from(reviews)
			.where(eq(reviews.productId, productId));

		const avgRating = avgResult[0]?.avg 
			? Number(avgResult[0].avg).toFixed(1)
			: "0";

		return {
			success: true,
			data: {
				reviews: reviewsData,
				averageRating: avgRating,
				totalReviews: avgResult.length,
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

		const result = await db
			.insert(reviews)
			.values({
				productId,
				userId: user.id,
				rating,
				comment,
			})
			.returning();

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

		const existing = await db
			.select()
			.from(reviews)
			.where(eq(reviews.id, reviewId));

		if (!existing[0] || existing[0].userId !== user.id) {
			context.set.status = 404;
			return { success: false, message: "Review not found" };
		}

		await db.delete(reviews).where(eq(reviews.id, reviewId));
		return { success: true, message: "Review deleted" };
	});