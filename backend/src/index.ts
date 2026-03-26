import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { productsModule } from "./modules/products";
import { authModule } from "./modules/auth";
import { cartModule } from "./modules/cart";
import { ordersModule } from "./modules/orders";
import logixlysia from "logixlysia";
import { profileModule } from "./modules/profile";
import { rateLimit } from "elysia-rate-limit";

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
	.use(limiter)
	.use(authModule)
	.use(productsModule)
	.use(cartModule)
	.use(ordersModule)
	.use(profileModule)
	.listen(3001);

export default app;
