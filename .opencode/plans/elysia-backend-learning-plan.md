# Rencana Implementasi E-Commerce API dengan Elysia (Bun + Elysia Terbaru)

## Status
- Dependencies: ✅ Terinstall
- Struktur Folder: ✅ Dibuat
- Implementasi: ✅ Selesai

---

## Dependencies yang Dibutuhkan
```json
{
  "dependencies": {
    "elysia": "latest",
    "drizzle-orm": "latest",
    "jose": "latest",
    "bcrypt": "latest",
    "@sinclair/typebox": "latest"
  },
  "devDependencies": {
    "bun-types": "latest",
    "drizzle-kit": "latest",
    "@types/bcrypt": "latest"
  }
}
```

> **Note:** Gunakan `bun:sqlite` (built-in Bun) bukan `better-sqlite3`

---

## File yang Perlu Dibuat

### 1. Database Schema (`src/db/schema.ts`)
```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["customer", "admin"] }).notNull().default("customer"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  category: text("category"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const carts = sqliteTable("carts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status", { enum: ["pending", "paid", "shipped", "completed", "cancelled"] })
    .notNull().default("pending"),
  shippingAddress: text("shipping_address").notNull(),
  phone: text("phone").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
```

### 2. Database Connection (`src/db/index.ts`)
```typescript
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

const sqlite = new Database("ecommerce.db");
export const db = drizzle(sqlite, { schema });
export * from "./schema";
```

### 3. Drizzle Config (`drizzle.config.ts`)
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "ecommerce.db",
  },
});
```

### 4. Products Module (`src/modules/products/index.ts`)
```typescript
import { Elysia, t } from "elysia";
import { db, products, type NewProduct, type Product } from "../../db";
import { eq } from "drizzle-orm";

export const productsModule = new Elysia({ prefix: "/products" })
  .get("/", async () => {
    const allProducts = await db.select().from(products);
    return { success: true, data: allProducts };
  })
  .get("/:id", async ({ params, set }) => {
    const product = await db.select().from(products).where(eq(products.id, Number(params.id)));
    if (!product[0]) {
      set.status = 404;
      return { success: false, message: "Product not found" };
    }
    return { success: true, data: product[0] };
  })
  .post("/", async ({ body, set }) => {
    const newProduct: NewProduct = body as NewProduct;
    const result = await db.insert(products).values(newProduct).returning();
    set.status = 201;
    return { success: true, data: result[0] };
  }, {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      price: t.Number(),
      stock: t.Optional(t.Number()),
      imageUrl: t.Optional(t.String()),
      category: t.Optional(t.String()),
    }),
  })
  .put("/:id", async ({ params, body, set }) => {
    const existing = await db.select().from(products).where(eq(products.id, Number(params.id)));
    if (!existing[0]) {
      set.status = 404;
      return { success: false, message: "Product not found" };
    }
    const result = await db.update(products)
      .set(body as Partial<Product>)
      .where(eq(products.id, Number(params.id)))
      .returning();
    return { success: true, data: result[0] };
  })
  .delete("/:id", async ({ params, set }) => {
    const existing = await db.select().from(products).where(eq(products.id, Number(params.id)));
    if (!existing[0]) {
      set.status = 404;
      return { success: false, message: "Product not found" };
    }
    await db.delete(products).where(eq(products.id, Number(params.id)));
    return { success: true, message: "Product deleted" };
  });
```

### 5. Auth Module (`src/modules/auth/index.ts`)
```typescript
import { Elysia, t } from "elysia";
import { db, users } from "../../db";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcrypt";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

export const authModule = new Elysia({ prefix: "/auth" })
  .post("/register", async ({ body, set }) => {
    const { email, password, name } = body as { email: string; password: string; name: string };
    
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing[0]) {
      set.status = 400;
      return { success: false, message: "Email already registered" };
    }

    const hashedPassword = await hash(password, 10);
    const result = await db.insert(users)
      .values({ email, password: hashedPassword, name })
      .returning();

    const token = await new SignJWT({ userId: result[0].id, role: result[0].role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    return { success: true, data: { user: result[0], token } };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String({ minLength: 6 }),
      name: t.String(),
    }),
  })
  .post("/login", async ({ body, set }) => {
    const { email, password } = body as { email: string; password: string };

    const user = await db.select().from(users).where(eq(users.email, email));
    if (!user[0]) {
      set.status = 401;
      return { success: false, message: "Invalid credentials" };
    }

    const isValid = await compare(password, user[0].password);
    if (!isValid) {
      set.status = 401;
      return { success: false, message: "Invalid credentials" };
    }

    const token = await new SignJWT({ userId: user[0].id, role: user[0].role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    return { success: true, data: { user: user[0], token } };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  });

export const authMiddleware = new Elysia({ name: "auth" }).derive(
  { as: "scoped" },
  async ({ headers, status }) => {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return status(401, { success: false, message: "Unauthorized" });
    }

    const token = authHeader.slice(7);
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return {
        user: payload as { userId: number; role: string },
      };
    } catch {
      return status(401, { success: false, message: "Invalid token" });
    }
  },
);
```

### 6. Cart Module (`src/modules/cart/index.ts`)
```typescript
import { Elysia, t } from "elysia";
import { db, carts, products } from "../../db";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "../auth";

export const cartModule = new Elysia({ prefix: "/cart" })
  .use(authMiddleware)
  .get("/", async ({ user }) => {
    const cartItems = await db
      .select({
        cartId: carts.id,
        quantity: carts.quantity,
        product: products,
      })
      .from(carts)
      .innerJoin(products, eq(carts.productId, products.id))
      .where(eq(carts.userId, user.userId));
    
    return { success: true, data: cartItems };
  })
  .post("/", async ({ user, body, set }) => {
    const { productId, quantity = 1 } = body as { productId: number; quantity?: number };
    
    const product = await db.select().from(products).where(eq(products.id, productId));
    if (!product[0]) {
      set.status = 404;
      return { success: false, message: "Product not found" };
    }

    const existing = await db.select().from(carts)
      .where(and(eq(carts.userId, user.userId), eq(carts.productId, productId)));

    if (existing[0]) {
      await db.update(carts)
        .set({ quantity: existing[0].quantity + quantity })
        .where(eq(carts.id, existing[0].id));
    } else {
      await db.insert(carts).values({
        userId: user.userId,
        productId,
        quantity,
      });
    }

    return { success: true, message: "Item added to cart" };
  }, {
    body: t.Object({
      productId: t.Number(),
      quantity: t.Optional(t.Number()),
    }),
  })
  .delete("/:id", async ({ user, params, set }) => {
    const cartItem = await db.select().from(carts)
      .where(and(eq(carts.id, Number(params.id)), eq(carts.userId, user.userId)));
    
    if (!cartItem[0]) {
      set.status = 404;
      return { success: false, message: "Cart item not found" };
    }

    await db.delete(carts).where(eq(carts.id, Number(params.id)));
    return { success: true, message: "Item removed from cart" };
  });
```

### 7. Orders Module (`src/modules/orders/index.ts`)
```typescript
import { Elysia, t } from "elysia";
import { db, orders, orderItems, carts, products } from "../../db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../auth";

export const ordersModule = new Elysia({ prefix: "/orders" })
  .use(authMiddleware)
  .get("/", async ({ user }) => {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, user.userId));
    return { success: true, data: userOrders };
  })
  .post("/", async ({ user, body, set }) => {
    const { shippingAddress, phone, notes } = body as any;

    const cartItems = await db
      .select({
        cartId: carts.id,
        productId: carts.productId,
        quantity: carts.quantity,
        price: products.price,
      })
      .from(carts)
      .innerJoin(products, eq(carts.productId, products.id))
      .where(eq(carts.userId, user.userId));

    if (cartItems.length === 0) {
      set.status = 400;
      return { success: false, message: "Cart is empty" };
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await db.insert(orders)
      .values({
        userId: user.userId,
        total,
        shippingAddress,
        phone,
        notes,
      })
      .returning();

    for (const item of cartItems) {
      await db.insert(orderItems).values({
        orderId: order[0].id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
      await db.delete(carts).where(eq(carts.id, item.cartId));
    }

    return { success: true, data: order[0] };
  }, {
    body: t.Object({
      shippingAddress: t.String(),
      phone: t.String(),
      notes: t.Optional(t.String()),
    }),
  })
  .get("/:id", async ({ user, params, set }) => {
    const order = await db.select().from(orders)
      .where(eq(orders.id, Number(params.id)));
    
    if (!order[0] || order[0].userId !== user.userId) {
      set.status = 404;
      return { success: false, message: "Order not found" };
    }

    const items = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order[0].id));

    return { success: true, data: { order: order[0], items } };
  });
```

### 8. Main Index (`src/index.ts`)
```typescript
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
    }
  }))
  .use(authModule)
  .use(productsModule)
  .use(cartModule)
  .use(ordersModule)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
```

---

## Catatan Penting (Elysia Versi Terbaru)

### 1. Database Connection
Gunakan `bun:sqlite` karena `better-sqlite3` tidak didukung Bun:
```typescript
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
```

### 2. Auth Middleware
Gunakan `derive({ as: "scoped" }, ...)` dan `status()` untuk sharing type:
```typescript
export const authMiddleware = new Elysia({ name: "auth" }).derive(
  { as: "scoped" },
  async ({ headers, status }) => {
    // Gunakan status() bukan throw Error
    return status(401, { success: false, message: "Unauthorized" });
  },
);
```

### 3. Error Handler
Gunakan `status()` bukan `set.status` + mengakses `error.message`:
```typescript
.onError(({ code, error, status }) => {
  if (code === "VALIDATION") {
    return status(400, { success: false, message: String(error) });
  }
  return status(500, { success: false, message: "Internal server error" });
})
```

---

## Langkah Eksekusi

1. **Jalankan database migration**
   ```bash
   bunx drizzle-kit push
   ```

2. **Test API**
   ```bash
   bun run dev
   ```

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register user baru | No |
| POST | /auth/login | Login user | No |
| GET | /products | List semua produk | No |
| GET | /products/:id | Detail produk | No |
| POST | /products | Tambah produk | No* |
| PUT | /products/:id | Update produk | No* |
| DELETE | /products/:id | Hapus produk | No* |
| GET | /cart | Lihat cart | Yes |
| POST | /cart | Tambah ke cart | Yes |
| DELETE | /cart/:id | Hapus dari cart | Yes |
| GET | /orders | List orders | Yes |
| POST | /orders | Buat order | Yes |
| GET | /orders/:id | Detail order | Yes |

*Admin only (nanti ditambahkan)
