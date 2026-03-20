import { Elysia, t } from "elysia";
import { db, products, type NewProduct, type Product } from "../../db";
import { eq } from "drizzle-orm";

export const productsModule = new Elysia({ prefix: "/product" })
	.get("/", async () => {
		const allProducts = await db.select().from(products);
		return { success: true, data: allProducts };
	})
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
