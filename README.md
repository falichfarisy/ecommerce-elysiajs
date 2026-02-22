# E-Commerce API dengan Elysia

REST API untuk e-commerce menggunakan ElysiaJS dan Bun runtime.

## Fitur

- Authentication (Register & Login dengan JWT)
- CRUD Products
- Shopping Cart
- Orders Management

## Tech Stack

- **Runtime:** Bun
- **Framework:** ElysiaJS
- **Database:** SQLite (bun:sqlite)
- **ORM:** Drizzle ORM
- **Auth:** JWT (jose)
- **Password Hashing:** bcrypt

## Struktur Project

```
src/
├── db/
│   ├── index.ts          # Database connection
│   └── schema.ts         # Database schema & types
├── modules/
│   ├── auth/index.ts     # Auth routes & middleware
│   ├── cart/index.ts     # Cart routes
│   ├── orders/index.ts   # Orders routes
│   └── products/index.ts # Products routes
└── index.ts              # Main application
```

## Instalasi

```bash
bun install
```

## Setup Database

```bash
bunx drizzle-kit push
```

## Development

```bash
bun run dev
```

Server berjalan di `http://localhost:3000`

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user baru |
| POST | /auth/login | Login user |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | List semua produk |
| GET | /products/:id | Detail produk |
| POST | /products | Tambah produk |
| PUT | /products/:id | Update produk |
| DELETE | /products/:id | Hapus produk |

### Cart (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /cart | Lihat cart |
| POST | /cart | Tambah ke cart |
| DELETE | /cart/:id | Hapus dari cart |

### Orders (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /orders | List orders |
| GET | /orders/:id | Detail order |
| POST | /orders | Buat order baru |

## Contoh Request

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","username":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:3000/products
```

### Create Product
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":15000000,"stock":10}'
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":1,"quantity":2}'
```

### Create Order
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"shippingAddress":"Jl. Test No. 123","phone":"08123456789"}'
```

## Response Format

Semua response menggunakan format:

```json
{
  "success": true|false,
  "data": {...}|"message": "..."
}
```
testing perubahan menggunakn CI/CD