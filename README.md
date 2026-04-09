# ShopCo E-Commerce

Modern e-commerce platform built with Next.js (Frontend) and ElysiaJS (Backend).

## Project Structure

```
ecommerce/
├── frontend/          # Next.js 15 App
│   ├── app/          # App Router pages
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utilities & configs
│   └── public/       # Static assets
│
└── backend/          # ElysiaJS API
    ├── src/
    │   └── modules/ # Feature modules
    └── .env         # Environment variables
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: React hooks
- **Fonts**: Geist (Next.js font)

### Backend  
- **Framework**: ElysiaJS
- **Database**: (configured in .env)
- **Auth**: JWT sessions

## Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

API runs on [http://localhost:3001](http://localhost:3001)

## Environment

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```env
DATABASE_URL=your_db_url
JWT_SECRET=your_secret
PORT=3001
```

## Features

- Product catalog with categories
- Shopping cart
- User authentication
- Product detail pages
- Responsive design

## Routes

### Frontend
| Path | Description |
|------|-------------|
| `/` | Home page |
| `/product/[id]` | Product detail |
| `/cart` | Shopping cart |
| `/login` | Sign in |
| `/register` | Sign up |

### Backend API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/get-session` | GET | Get current session |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |

## Scripts

### Frontend
```bash
npm run dev      # Development server
npm run build   # Production build
npm run start   # Start production
npm run lint    # Run linter
```

### Backend
```bash
npm run dev     # Development server  
npm run build   # Production build
npm run start   # Start production
```

## License

MIT