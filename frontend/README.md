# Frontend Documentation

## Overview

Next.js 15 e-commerce frontend with App Router, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **Next.js 15** - App Router, Turbopack
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **TypeScript** - Type safety

## Project Structure

```
frontend/
├── app/                    # App Router
│   ├── home/              # Home page component
│   ├── product/[id]/      # Product detail page
│   ├── cart/              # Shopping cart page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── ApiConfig.ts       # API client
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Root redirect
│
├── components/
│   └── ui/               # shadcn/ui components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── ...
│
├── lib/
│   └── utils.ts          # Utilities (cn function)
│
├── public/               # Static assets
├── tailwind.config.ts     # Tailwind config
├── next.config.ts        # Next.js config
└── package.json
```

## Pages

### Home Page (`/`)
- Hero carousel with promotions
- Category navigation
- Flash sale section
- Recommended products grid

### Product Detail (`/product/[id]`)
- Image gallery with thumbnails
- Product info (name, brand, price)
- Rating and reviews
- Quantity selector
- Add to cart button
- Tabs: Description, Specifications, Reviews, FAQ

### Shopping Cart (`/cart`)
- Cart items list with quantity controls
- Order summary
- Promo code input
- Checkout button
- Trust badges

### Auth Pages (`/login`, `/register`)
- Form with validation
- Session management

## Components

### Button
```tsx
import { Button } from "@/components/ui/Button";

// Variants: default, outline, ghost, secondary, link
// Sizes: sm, md, lg, icon, icon-sm

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
```

### Card
```tsx
import { Card, CardContent, CardFooter } from "@/components/ui/Card";

<Card>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer here</CardFooter>
</Card>
```

### Input
```tsx
import { Input } from "@/components/ui/Input";

<Input type="email" placeholder="email@example.com" />
```

## API Integration

### Using getData
```tsx
import { getData } from "@/app/ApiConfig";

const data = await getData("/api/endpoint");
```

## Styling

### Tailwind Classes

**Layout**
- `flex`, `grid`, `block`
- `container`, `mx-auto`, `px-4`

**Spacing**
- `p-4`, `m-4`, `gap-4`
- `pt-4`, `pb-4`, `mt-4`, `mb-4`

**Typography**
- `text-xl`, `font-bold`, `text-gray-900`
- `leading-tight`, `line-clamp-2`

**Colors**
- `bg-white`, `bg-gray-50`, `bg-indigo-600`
- `text-gray-500`, `text-indigo-600`

**Effects**
- `shadow-sm`, `shadow-lg`, `shadow-xl`
- `rounded-lg`, `rounded-xl`, `rounded-full`
- `transition-all`, `duration-300`

## Responsive Design

```tsx
// Mobile first approach
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

Breakpoints:
- `sm` - 640px
- `md` - 768px  
- `lg` - 1024px
- `xl` - 1280px

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Building

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Code Conventions

1. Use `cn()` utility from lib/utils.ts for conditional classes
2. Use shadcn/ui components from components/ui/
3. Follow Tailwind CSS ordering (layout → spacing → sizing → colors → effects → typography → transitions)
4. Use `asChild` prop for polymorphic components
5. Keep components in components/ui/
6. Use `.tsx` for React components