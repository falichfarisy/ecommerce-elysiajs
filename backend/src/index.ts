import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { productsModule } from "./modules/products";
import { authModule } from "./modules/auth";
import { cartModule } from "./modules/cart";
import { ordersModule } from "./modules/orders";
import logixlysia from "logixlysia";
import { profileModule } from "./modules/profile";
import { rateLimit } from "elysia-rate-limit";
import { paymentModule } from "./modules/payment";
import { emailModule } from "./modules/email";
import { rbacModule } from "./modules/rbac";
import { inventoryModule } from "./modules/inventory";
import { reviewModule } from "./modules/reviews";
import { wishlistModule } from "./modules/wishlist";

const limiter = rateLimit({
	duration: 60000,
	max: 10,
});

const app = new Elysia()
	.use(cors({
		origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true,
	}))
	.use(logixlysia({
		config: {
			showStartupMessage: true,
			startupMessageFormat: 'simple',
			ip: true,
			logFilePath: './logs/app.log'
		}
	}))
	.use(openapi({
		documentation: {
			info: {
				title: "E-Commerce API",
				version: "1.0.0",
				description: "E-Commerce REST API with PostgreSQL",
			},
			tags: [
				{ name: "Auth", description: "Authentication endpoints" },
				{ name: "Products", description: "Product management" },
				{ name: "Cart", description: "Shopping cart" },
				{ name: "Orders", description: "Order management" },
				{ name: "Payment", description: "Payment processing" },
				{ name: "RBAC", description: "Role-based access control" },
				{ name: "Inventory", description: "Inventory management" },
				{ name: "Reviews", description: "Product reviews and ratings" },
				{ name: "Wishlist", description: "User wishlist" },
			],
		},
	}))
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
			auth: ["/api/auth/register", "/api/auth/sign-in"],
			products: ["/product", "/product/:id"],
			cart: ["/cart"],
			orders: ["/orders", "/orders/:id"],
			payment: ["/payment/create-payment-intent"],
			docs: ["/openapi", "/swagger"],
		},
	}))
	.use(limiter)
	.use(authModule)
	.use(productsModule)
	.use(cartModule)
	.use(ordersModule)
	.use(profileModule)
	.use(paymentModule)
	.use(emailModule)
	.use(rbacModule)
	.use(inventoryModule)
	.use(reviewModule)
	.use(wishlistModule)
	.listen(3001);

export default app;
