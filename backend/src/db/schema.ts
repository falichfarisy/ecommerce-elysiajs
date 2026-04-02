import { pgTable, text, integer, real, index, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" })
		.default(false)
		.notNull(),
	image: text("image"),
	createdAt: timestamp("created_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at", { mode: "date" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.default(sql`now()`)
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "date" }),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: "date" }),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at", { mode: "date" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.default(sql`now()`)
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
		createdAt: timestamp("created_at", { mode: "date" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.default(sql`now()`)
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userProfile = pgTable("user_profile", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	username: text("username").notNull(),
	phone: text("phone"),
	role: text("role", { enum: ["customer", "admin"] })
		.notNull()
		.default("customer"),
});

export const products = pgTable("products", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	description: text("description"),
	price: real("price").notNull(),
	stock: integer("stock").notNull().default(0),
	imageUrl: text("image_url"),
	category: text("category"),
	createdAt: timestamp("created_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
});

export const carts = pgTable("carts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	productId: integer("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull().default(1),
	createdAt: timestamp("created_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
});

export const orders = pgTable("orders", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	total: real("total").notNull(),
	status: text("status", { enum: ["pending", "paid", "shipped", "completed", "cancelled"] })
		.notNull()
		.default("pending"),
	shippingAddress: text("shipping_address").notNull(),
	phone: text("phone").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
});

export const orderItems = pgTable("order_items", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	orderId: integer("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	productId: integer("product_id")
		.notNull()
		.references(() => products.id),
	quantity: integer("quantity").notNull(),
	price: real("price").notNull(),
	createdAt: timestamp("created_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
});

export const reviews = pgTable("reviews", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	productId: integer("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	createdAt: timestamp("created_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
});

export const wishlists = pgTable("wishlists", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	productId: integer("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { mode: "date" })
		.default(sql`now()`)
		.notNull(),
});

export const userRelations = relations(user, ({ one }) => ({
	profile: one(userProfile, {
		fields: [user.id],
		references: [userProfile.userId],
	}),
	sessions: one(session, {
		fields: [user.id],
		references: [session.userId],
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
