import { Elysia, t } from "elysia";
import { db, products, type NewProduct, type Product } from "../../db";
import { eq, like, and, or, desc, asc, gte, lte, sql } from "drizzle-orm";

export const productsModule = new Elysia({ prefix: "/product" })
	.get(
		"/",
		async ({ query, set }) => {
			const page = Number(query.page) || 1;
			const limit = Number(query.limit) || 20;
			const search = query.search as string | undefined;
			const category = query.category as string | undefined;
			const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
			const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
			const sortBy = (query.sortBy as string) || "createdAt";
			const sortOrder = (query.sortOrder as string) || "desc";

			const conditions = [];

			if (search) {
				conditions.push(
					or(
						like(products.name, `%${search}%`),
						like(products.description, `%${search}%`)
					)
				);
			}

			if (category) {
				conditions.push(eq(products.category, category));
			}

			if (minPrice !== undefined) {
				conditions.push(gte(products.price, minPrice));
			}

			if (maxPrice !== undefined) {
				conditions.push(lte(products.price, maxPrice));
			}

			const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

			const offset = (page - 1) * limit;
			
			let sortColumn: any;
			switch (sortBy) {
				case "price":
					sortColumn = products.price;
					break;
				case "name":
					sortColumn = products.name;
					break;
				case "createdAt":
				default:
					sortColumn = products.createdAt;
					break;
			}
			const orderFn = sortOrder === "asc" ? asc : desc;

			const [allProducts, totalCount] = await Promise.all([
				db
					.select()
					.from(products)
					.where(whereClause)
					.limit(limit)
					.offset(offset)
					.orderBy(orderFn(sortColumn)),
				db
					.select({ count: sql<number>`count(*)` })
					.from(products)
					.where(whereClause),
			]);

			return {
				success: true,
				data: allProducts,
				pagination: {
					page,
					limit,
					total: totalCount[0]?.count || 0,
					totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
				},
			};
		},
		{
			query: t.Object({
				page: t.Optional(t.Number()),
				limit: t.Optional(t.Number()),
				search: t.Optional(t.String()),
				category: t.Optional(t.String()),
				minPrice: t.Optional(t.Number()),
				maxPrice: t.Optional(t.Number()),
				sortBy: t.Optional(t.Union([t.Literal("price"), t.Literal("name"), t.Literal("createdAt")])),
				sortOrder: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
			}),
		},
	)

	.get(
		"/categories",
		async () => {
			const categories = await db
				.selectDistinct({ category: products.category })
				.from(products)
				.where(sql`${products.category} IS NOT NULL`);

			return {
				success: true,
				data: categories.map((c) => c.category).filter(Boolean),
			};
		},
	)

	.get("/:id", async ({ params, set }) => {
		const product = await db
			.select()
			.from(products)
			.where(eq(products.id, Number(params.id)));
		if (!product[0]) {
			set.status = 404;
			return { success: false, message: "Product not found" };
		}
		return { success: true, data: product[0] };
	})
	.post(
		"/",
		async ({ body, set }) => {
			const newProduct: NewProduct = body as NewProduct;
			const result = await db.insert(products).values(newProduct).returning();
			set.status = 201;
			return { success: true, data: result[0] };
		},
		{
			body: t.Object({
				name: t.String(),
				description: t.Optional(t.String()),
				price: t.Number(),
				stock: t.Optional(t.Number()),
				imageUrl: t.Optional(t.String()),
				category: t.Optional(t.String()),
			}),
		},
	)

	.put("/:id", async ({ params, body, set }) => {
		const existing = await db
			.select()
			.from(products)
			.where(eq(products.id, Number(params.id)));
		if (!existing[0]) {
			set.status = 404;
			return { success: false, message: "Product not found" };
		}

		const result = await db
			.update(products)
			.set(body as Partial<Product>)
			.where(eq(products.id, Number(params.id)))
			.returning();
		return { success: true, data: result[0] };
	})

	.delete("/:id", async ({ params, set }) => {
		const existing = await db
			.select()
			.from(products)
			.where(eq(products.id, Number(params.id)));
		if (!existing[0]) {
			set.status = 404;
			return { success: false, message: "Product not found" };
		}
		await db.delete(products).where(eq(products.id, Number(params.id)));
		return { success: true, message: "Product deleted" };
	});
