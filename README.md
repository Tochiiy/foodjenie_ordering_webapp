# FoodJenie - Food Delivery Platform

[![CI/CD Pipeline](https://github.com/Tochiiy/foodjenie_ordering_webapp/actions/workflows/ci.yml/badge.svg)](https://github.com/Tochiiy/foodjenie_ordering_webapp/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/frontend-vercel-%23000000?logo=vercel)](https://foodjenie.vercel.app)
[![Render](https://img.shields.io/badge/backend-render-%2346E3B7?logo=render)](https://foodjenie-ordering-webapp.onrender.com)

**Live:** [https://foodjenie.vercel.app](https://foodjenie.vercel.app) (frontend)  
**API:** [https://foodjenie-ordering-webapp.onrender.com](https://foodjenie-ordering-webapp.onrender.com) (backend)

A full-stack food delivery platform built with the **MERN stack** (MongoDB, Express, React, Node.js). Users can browse restaurants, view menus, manage a cart, pay via Stripe, and track orders. AI-powered features include recipe generation, dish descriptions, and review sentiment analysis.

---

## Features

- **User Authentication** — Register, login, JWT in httpOnly cookies, profile management, account deletion
- **Restaurant Browsing** — Search by keyword, filter by cuisine, sort by ratings/reviews, 100+ seeded restaurants
- **Menu Management** — Categorized menus with food items, prices, descriptions, stock tracking
- **Shopping Cart** — Add/remove items, update quantities, persisted per user per restaurant
- **Stripe Payments** — Secure Checkout Sessions with shipping address collection, multi-currency
- **Order Tracking** — Order history, detail view, delivery status
- **Coupon System** — Discount validation with MongoDB aggregation pipeline (min amount, max discount)
- **AI Recipe Generator** — Generate recipes from ingredients via Groq API (LLaMA 3.1)
- **AI Dish Descriptions** — Auto-generate tags, allergens, serving size, best-for timings
- **AI Review Analysis** — Sentiment analysis with summary bullets and top mentions
- **Responsive UI** — React-Bootstrap, mobile-friendly, Font Awesome icons
- **State Management** — Redux Toolkit (user, cart, orders, restaurants, menus slices)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite 8** | Build tool and dev server (proxy `/api` → `:8080`) |
| **Redux Toolkit** | State management with 5 slices |
| **React Router v7** | Client-side SPA routing (18 routes) |
| **React-Bootstrap** | UI components and responsive grid |
| **react-toastify** | Toast notifications |
| **Font Awesome** | Icons |
| **Axios** | HTTP client with credentials |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime (ES Modules) |
| **Express 5** | Web framework with modular routing |
| **MongoDB + Mongoose 9** | Database and ODM (7 models) |
| **JWT + bcryptjs** | Token auth with httpOnly cookies |
| **Stripe SDK** | Payment processing (Checkout Sessions) |
| **Cloudinary** | Image upload/CDN |
| **Groq API** | AI (LLaMA 3.1) for recipes, descriptions, sentiment |
| **Nodemailer + Pug** | Email templates |
| **dotenv** | Environment configuration |

### DevOps
| Tool | Purpose |
|---|---|
| **Docker** | Multi-stage containerization |
| **docker-compose** | Local orchestration (frontend + backend) |
| **Nginx** | Production frontend server |
| **GitHub Actions** | CI/CD pipeline |
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |

---

## Project Structure

```
Food_Delivery_Website/
├── backend/
│   ├── config/          # config.env, database.js, cloudinary.js
│   ├── controllers/     # 9 controllers (auth, restaurant, menu, foodItem, cart, order, payment, coupon, AI)
│   ├── models/          # 7 models (User, Restaurant, Menu, FoodItem, Cart, Order, Coupon)
│   ├── routes/          # 9 route files (dual-mounted for backward compat)
│   ├── services/        # 3 AI services (dish descriptions, review analysis, recipe generation)
│   ├── middlewares/     # auth, authorizeRoles, catchAsyncErrors, error handler
│   ├── utils/           # sendToken, apiFeatures, errorHandler, email, seeder scripts
│   ├── views/           # Pug email templates
│   ├── data/            # Seed JSON files
│   ├── tests/           # Vitest test setup
│   ├── app.js           # Express app entry
│   ├── server.js        # Server bootstrap
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/          # Static assets, favicon.svg
│   ├── src/
│   │   ├── Components/
│   │   │   ├── layout/  # Header, Footer, Loader, Search
│   │   │   └── 14 pages # Home, Menu, Cart, Login, Register, Profile, UpdateProfile,
│   │   │                # Shipping, ConfirmOrder, Payment, OrderSuccess, MyOrders,
│   │   │                # OrderDetails, ForgotPassword, RecipeGenerator
│   │   ├── redux/
│   │   │   ├── slices/  # 5 slices (restaurant, menu, user, cart, orders)
│   │   │   ├── actions/ # 5 action files
│   │   │   └── store.js
│   │   ├── utils/       # Axios instance with interceptors
│   │   ├── App.jsx      # Root component with 18 routes
│   │   └── main.jsx     # Entry point
│   ├── __tests__/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .github/workflows/   # CI/CD pipeline
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB Atlas** account
- **Stripe** account (test mode)
- **Cloudinary** account
- **Groq API** key (for AI features)

---

## Environment Variables

### Backend (`backend/config/config.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `8080`) |
| `DB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES` | Token expiry (default: `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `DEFAULT_CURRENCY` | Currency (default: `usd`) |
| `DELIVERY_AMOUNT` | Delivery fee in cents (default: `500`) |
| `FRONTEND_URL` | Frontend origin for CORS |
| `NODE_ENV` | Set to `production` in deployment (required for cross-origin cookies) |
| `GROQ_API_KEY` | Groq API key for AI features |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | _(empty — uses Vite proxy)_ |

---

## Installation

### 1. Clone & install

```bash
git clone https://github.com/Tochiiy/foodjenie_ordering_webapp.git
cd Food_Delivery_Website

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Create `backend/config/config.env` with your keys (see table above). Create `frontend/.env` if deploying separately.

### 3. Seed the database

```bash
cd backend
npm run seed                 # Seed food items
npm run seed:restaurants100  # Seed 100 restaurants across 8 cuisines
```

### 4. Start development

```bash
# Terminal 1 - Backend
cd backend && npm start       # → http://localhost:8080

# Terminal 2 - Frontend
cd frontend && npm run dev    # → http://localhost:5173
```

The Vite dev server proxies `/api` → `localhost:8080` automatically.

---

## API Endpoints

All routes prefixed with `/api/v1`. Auth via httpOnly JWT cookie.

### Auth — `/api/v1/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register |
| POST | `/login` | No | Login |
| GET | `/me` | Yes | Get profile |
| PUT | `/me` | Yes | Update profile |
| DELETE | `/me` | Yes | Delete account |
| POST | `/logout` | Yes | Logout |

### Restaurants — `/api/v1/eats/stores`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List (search, sort) |
| GET | `/:storeId` | Get single |
| GET | `/:storeId/menus` | Get menus |

### Cart — `/api/v1/cart` (auth required)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Add item |
| GET | `/` | Get cart |
| PUT | `/item/:id` | Update quantity |
| DELETE | `/item/:id` | Remove item |
| DELETE | `/clear/:restaurantId` | Clear cart |

### Orders — `/api/v1/orders` (auth required)
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/` | User | Create order |
| GET | `/` | User | My orders |
| GET | `/:id` | User | Order detail |
| GET | `/admin/all` | Admin | All orders |
| PUT | `/admin/:id` | Admin | Update status |

### Payment — `/api/v1/payment` (auth required)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/process` | Create Stripe Checkout Session |
| GET | `/stripeapikey` | Get publishable key |

### Coupons — `/api/v1/coupon`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create |
| GET | `/` | List |
| POST | `/validate` | Validate against cart total |

### AI — `/api/v1/ai`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/generate-food-ai` | Generate dish descriptions |
| POST | `/recipe/generate` | Generate recipe from ingredients |
| PUT | `/stores/:id/review` | Add review + AI analysis |

---

## Testing

```bash
cd backend && npm test
cd frontend && npm run build   # Verify production build
```

---

## Deployment

- **Frontend — [Vercel](https://foodjenie.vercel.app):** Root dir `frontend`, Framework Vite, set `VITE_API_URL=https://foodjenie-ordering-webapp.onrender.com` in env vars
- **Backend — [Render](https://foodjenie-ordering-webapp.onrender.com):** Root dir `backend`, Docker runtime, port `8080`, add all env vars from the table above and set `NODE_ENV=production`
- **Local Docker:** `docker-compose up --build` for full-stack

---

## License

ISC
