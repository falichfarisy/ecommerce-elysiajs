import { Elysia, t } from "elysia";
import { db, products } from "../../db";
import { eq, and, lte, gte, sql } from "drizzle-orm";
import { authMiddleware } from "../auth";
import { getUserRole, hasPermission } from "../rbac";

const LOW_STOCK_THRESHOLD = 10;

export async function deductStock(productId: number, quantity: number): Promise<boolean> {
	const product = await db.select().from(products).where(eq(products.id, productId));
	if (!product[0] || product[0].stock < quantity) {
		return false;
	}

	await db
		.update(products)
		.set({ stock: sql`${products.stock} - ${quantity}` })
		.where(eq(products.id, productId));
	return true;
}

export async function restoreStock(productId: number, quantity: number) {
	await db
		.update(products)
		.set({ stock: sql`${products.stock} + ${quantity}` })
		.where(eq(products.id, productId));
}

export const inventoryModule = new Elysia({ prefix: "/inventory" })
	.use(authMiddleware)

	.get("/low-stock", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const lowStockProducts = await db
			.select()
			.from(products)
			.where(lte(products.stock, LOW_STOCK_THRESHOLD));

		return { success: true, data: lowStockProducts };
	})

	.get("/stock/:productId", async ({ params, set }) => {
		const product = await db.select().from(products).where(eq(products.id, Number(params.productId)));
		if (!product[0]) {
			set.status = 404;
			return { success: false, message: "Product not found" };
		}

		return {
			success: true,
			data: {
				productId: product[0].id,
				stock: product[0].stock,
				lowStock: product[0].stock <= LOW_STOCK_THRESHOLD,
			},
		};
	})

	.post(
		"/adjust",
		async (context) => {
			const user = (context as any).user;
			if (!user) {
				context.set.status = 401;
				return { success: false, message: "Unauthorized" };
			}

			const role = await getUserRole(user.id);
			if (!hasPermission(role, "update:products")) {
				context.set.status = 403;
				return { success: false, message: "Forbidden: insufficient permissions" };
			}

			const body = context.body as { productId: number; adjustment: number; reason?: string };
			const { productId, adjustment, reason } = body;

			const product = await db.select().from(products).where(eq(products.id, productId));
			if (!product[0]) {
				context.set.status = 404;
				return { success: false, message: "Product not found" };
			}

			const newStock = product[0].stock + adjustment;
			if (newStock < 0) {
				context.set.status = 400;
				return { success: false, message: "Insufficient stock" };
			}

			await db.update(products).set({ stock: newStock }).where(eq(products.id, productId));

			return {
				success: true,
				message: `Stock adjusted. New stock: ${newStock}`,
			};
		},
		{
			body: t.Object({
				productId: t.Number(),
				adjustment: t.Number(),
				reason: t.Optional(t.String()),
			}),
		},
	)

	.get("/report", async (context) => {
		const user = (context as any).user;
		if (!user) {
			context.set.status = 401;
			return { success: false, message: "Unauthorized" };
		}

		const allProducts = await db.select().from(products);

		const report = {
			totalProducts: allProducts.length,
			totalStock: allProducts.reduce((sum, p) => sum + p.stock, 0),
			lowStockItems: allProducts.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).length,
			outOfStock: allProducts.filter((p) => p.stock === 0).length,
			byCategory: allProducts.reduce((acc, p) => {
				const cat = p.category || "Uncategorized";
				if (!acc[cat]) acc[cat] = { count: 0, stock: 0 };
				acc[cat].count++;
				acc[cat].stock += p.stock;
				return acc;
			}, {} as Record<string, { count: number; stock: number }>),
		};

		return { success: true, data: report };
	});