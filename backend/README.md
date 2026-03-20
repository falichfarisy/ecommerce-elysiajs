# E-Commerce API

REST API untuk e-commerce menggunakan ElysiaJS dan Bun runtime.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Bun |
| Framework | ElysiaJS |
| Database | SQLite (bun:sqlite) |
| ORM | Drizzle ORM |
| Auth | better-auth |
| Rate Limiting | elysia-rate-limit |
| Logging | logixlysia |

## Quick Start

```bash
bun install
bun run dev
```

Server runs at `http://localhost:3001`

---

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "session_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "emailVerified": false,
      "image": null
    }
  }
}
```

#### Login
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /api/auth/sign-out
Cookie: better-auth.session_token=YOUR_TOKEN
```

#### Get Current Session
```http
GET /api/auth/get-session
Cookie: better-auth.session_token=YOUR_TOKEN
```

#### Get Current User
```http
GET /api/auth/whoami
Cookie: better-auth.session_token=YOUR_TOKEN
```

---

### Products (Public)

#### List All Products
```http
GET /product
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "Gaming laptop",
      "price": 15000000,
      "stock": 10,
      "imageUrl": null,
      "category": "Electronics"
    }
  ]
}
```

#### Get Product by ID
```http
GET /product/:id
```

#### Create Product
```http
POST /product
Content-Type: application/json

{
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 15000000,
  "stock": 10,
  "category": "Electronics"
}
```

#### Update Product
```http
PUT /product/:id
Content-Type: application/json

{
  "name": "Laptop Pro",
  "price": 18000000
}
```

#### Delete Product
```http
DELETE /product/:id
```

---

### Shopping Cart (Auth Required)

> Requires `better-auth.session_token` cookie

#### View Cart
```http
GET /cart
Cookie: better-auth.session_token=YOUR_TOKEN
```

#### Add to Cart
```http
POST /cart
Content-Type: application/json
Cookie: better-auth.session_token=YOUR_TOKEN

{
  "productId": 1,
  "quantity": 2
}
```

#### Remove from Cart
```http
DELETE /cart/:id
Cookie: better-auth.session_token=YOUR_TOKEN
```

---

### Orders (Auth Required)

> Requires `better-auth.session_token` cookie

#### List Orders
```http
GET /orders
Cookie: better-auth.session_token=YOUR_TOKEN
```

#### Get Order Detail
```http
GET /orders/:id
Cookie: better-auth.session_token=YOUR_TOKEN
```

#### Create Order (from cart)
```http
POST /orders
Content-Type: application/json
Cookie: better-auth.session_token=YOUR_TOKEN

{
  "shippingAddress": "Jl. Sudirman No. 123",
  "phone": "081234567890",
  "notes": "Leave at door"
}
```

---

### Profile (Auth Required)

> Requires `better-auth.session_token` cookie

#### Get Profile
```http
GET /profile
Cookie: better-auth.session_token=YOUR_TOKEN
```

#### Update Profile
```http
PATCH /profile
Content-Type: application/json
Cookie: better-auth.session_token=YOUR_TOKEN

{
  "username": "NewUsername",
  "phone": "081987654321"
}
```

---

## Response Format

All endpoints return consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Success with message:**
```json
{
  "success": true,
  "message": "Item added to cart"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Environment Variables

```env
# better-auth OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Database Schema

### Core Tables
- `user` - User accounts (better-auth)
- `session` - User sessions (better-auth)
- `account` - OAuth accounts (better-auth)
- `verification` - Email verification (better-auth)
- `user_profile` - Extended user profile
- `products` - Product catalog
- `carts` - Shopping cart items
- `orders` - Order records
- `order_items` - Order line items
