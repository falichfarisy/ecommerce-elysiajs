import { Elysia } from "elysia";
import { productsModule } from "./modules/products";
import { authModule } from "./modules/auth";
import { cartModule } from "./modules/cart";
import { ordersModule } from "./modules/orders";

const app = new Elysia()
	.onError(({ code, error, status }) => {
		if (code === "VALIDATION") {
			return status(400, { success: false, message: String(error) });
		}
		if (code === "NOT_FOUND") {
			return status(404, { success: false, message: "Not Found" });
		}
		return status(500, { success: false, message: "Internal server error" });
	})
	.get("/", () => ({
		message: "E-Commerce API",
		version: "1.0.0",
		endpoints: {
			auth: ["/auth/register", "/auth/login"],
			products: ["/products", "/products/:id"],
			cart: ["/cart"],
			orders: ["/orders", "/orders/:id"],
		},
	}))
	.use(authModule)
	.use(productsModule)
	.use(cartModule)
	.use(ordersModule)
	.listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
