# FoodJenie — Architecture Document

## Internship Video Presentation — Full-Stack MERN Food Delivery Platform

---

## 1. Overview

**FoodJenie** is a full-stack food delivery web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It connects users with local restaurants for online food ordering and delivery. The platform supports restaurant browsing by cuisine and location, menu exploration, cart management, secure Stripe payment processing, order tracking, and AI-powered features including dish description generation, recipe creation, and review sentiment analysis.

**Live Demo Frontend:** `http://localhost:5173`  
**Backend API:** `http://localhost:8080`

---

## 2. Goals of Internship

This internship project was designed to achieve the following learning objectives:

| Goal | Description |
|---|---|
| **Hands-on MERN Stack Experience** | Build a complete production-grade application using MongoDB, Express.js, React, and Node.js from scratch |
| **Full-Stack Development Proficiency** | Implement every layer — database schema design, RESTful API development, state-managed frontend, authentication, and deployment |
| **Real-World Payment Integration** | Integrate Stripe Checkout Sessions for secure card payments with shipping address collection and multi-currency support |
| **AI Integration** | Connect with Groq's LLM API (LLaMA 3.1) for dish description generation, recipe creation from ingredients, and restaurant review sentiment analysis |
| **DevOps & CI/CD Exposure** | Docker containerization for both frontend and backend, docker-compose orchestration, and GitHub Actions pipeline setup |
| **State Management with Redux Toolkit** | Implement global state management with slices for user, cart, orders, restaurants, and menus |
| **Authentication & Security** | Implement JWT-based authentication with httpOnly cookies, bcrypt password hashing, role-based authorization, and input validation |
| **Database Design with MongoDB** | Design schemas with embedded and referenced documents, 2dsphere geospatial indexing, and MongoDB aggregation pipelines |

---

## 3. Brief Project Requirements

### Functional Requirements

| Feature | Description |
|---|---|
| **User Authentication** | Register, login, logout, profile management, password reset via email |
| **Restaurant Catalog** | Browse restaurants with search by keyword, filter by vegetarian-only, sort by ratings/reviews |
| **Menu Browsing** | View restaurant menus organized by categories with food items, descriptions, prices, and images |
| **Cart Management** | Add/remove items, update quantities, clear cart per restaurant, persisted to MongoDB per user |
| **Order Placement** | Shipping address input, order confirmation, Stripe payment redirect, order history tracking |
| **Stripe Payment** | Secure checkout sessions with line items, shipping address, delivery fee, multi-currency |
| **Coupon System** | Discount coupon validation with minimum amount checks and max discount limits via MongoDB aggregation |
| **AI Recipe Generation** | Generate recipes from a list of ingredients using Groq LLM (LLaMA 3.1) |
| **AI Dish Descriptions** | Auto-generate dish tags, allergens, serving size, best-for timings using AI |
| **Review Analysis** | Customer reviews with AI-powered sentiment analysis and summary bullet points |
| **Order History** | View past orders with detailed item lists, payment info, and delivery status |

### Non-Functional Requirements

| Requirement | Implementation |
|---|---|
| **Responsive UI** | React-Bootstrap grid system, mobile-friendly layouts, Font Awesome icons |
| **Security** | JWT in httpOnly cookies, bcrypt password hashing (cost factor 12), input sanitization, rate-limiting ready |
| **Performance** | MongoDB indexes (2dsphere, text), API features for search/sort/pagination, Vite fast refresh |
| **Scalability** | Modular architecture with separation of concerns, Docker containerization, stateless API design |

---

## 4. Architecture & Design

### High-Level System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Client Browser                         │
│                   http://localhost:5173                        │
└──────────────────────────┬───────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Vite Dev   │
                    │   Server    │
                    │ (Proxy /api)│
                    └──────┬──────┘
                           │
                    ┌──────▼───────────────────────────────────────┐
                    │         Express.js Backend (Port 8080)       │
                    │                                              │
                    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
                    │  │  Routes  │──│Controllers│──│  Models   │  │
                    │  └──────────┘  └──────────┘  └────┬─────┘  │
                    │                                    │        │
                    │  ┌──────────┐  ┌──────────┐       │        │
                    │  │Services  │  │Middlewares│       │        │
                    │  │(AI/Pay)  │  │(Auth/Err) │       │        │
                    │  └──────────┘  └──────────┘       │        │
                    │                                    │        │
                    └────────────────────────────────────┼────────┘
                                                         │
                                              ┌──────────▼──────────┐
                                              │     MongoDB Atlas    │
                                              │  (Cloud Database)    │
                                              └─────────────────────┘

                    ┌──────────────────────┐      ┌──────────────────┐
                    │   Groq AI (LLaMA 3.1) │      │   Stripe API     │
                    │  - Dish Descriptions  │      │ - Checkout       │
                    │  - Recipe Generation  │      │ - Payments       │
                    │  - Sentiment Analysis │      └──────────────────┘
                    └──────────────────────┘
```

### Tech Stack Breakdown

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | 18.3.1 | Component-based UI library |
| **Build Tool** | Vite | 8.x | Fast dev server and bundler |
| **State Management** | Redux Toolkit | 2.11.2 | Global state with slices |
| **Routing** | React Router DOM | 7.13.2 | Client-side SPA routing |
| **UI Library** | React-Bootstrap | 2.8.0 | Responsive components |
| **HTTP Client** | Axios | 1.14.0 | API communication |
| **Payment UI** | @stripe/react-stripe-js | 6.6.0 | Stripe Elements |
| **Notifications** | react-toastify | 11.0.5 | Toast notifications |
| **Backend Runtime** | Node.js | (latest LTS) | JavaScript runtime |
| **Web Framework** | Express | 5.2.1 | HTTP server and routing |
| **Database** | MongoDB + Mongoose | 9.6.3 | NoSQL data storage |
| **Authentication** | JWT + bcryptjs | 9.0.3 / 3.0.3 | Token + hash auth |
| **Payment** | Stripe SDK | 22.2.2 | Payment processing |
| **Media** | Cloudinary | 2.10.0 | Image upload/CDN |
| **Email** | Nodemailer + Pug | 8.0.10 / 3.0.4 | Email templates |
| **AI Provider** | Groq API (LLaMA 3.1) | — | AI content generation |

### Frontend Architecture

#### Component Tree

```
<App>
├── <ToastContainer />                    (react-toastify notifications)
├── <Router>
│   ├── <Header />                        (navigation bar, search, auth links)
│   ├── <div.container-fluid>
│   │   ├── Route "/" → <Home />          (restaurant listing, search, filters)
│   │   │              └── <CountRestaurant />  (veg-only toggle, sorting)
│   │   │              └── <Restaurant />       (individual restaurant cards)
│   │   ├── Route "/eats/stores/search/:keyword" → <Home />
│   │   ├── Route "/eats/stores/:id/menus" → <Menu />
│   │   │              └── <Fooditem />         (individual food item display)
│   │   ├── Route "/cart" → <Cart />
│   │   ├── Route "/login" → <Login />
│   │   ├── Route "/register" → <Register />
│   │   ├── Route "/me" → <Profile />
│   │   ├── Route "/me/update" → <UpdateProfile />
│   │   ├── Route "/shipping" → <Shipping />
│   │   ├── Route "/order/confirm" → <ConfirmOrder />
│   │   ├── Route "/payment" → <Payment />
│   │   ├── Route "/success" → <OrderSuccess />
│   │   ├── Route "/orders" → <MyOrders />
│   │   ├── Route "/order/:id" → <OrderDetails />
│   │   ├── Route "/password/forgot" → <ForgotPassword />
│   │   └── Route "/ai/recipe" → <RecipeGenerator />
│   └── <Footer />
```

#### Redux Store Structure

```javascript
store = {
  restaurants: {
    restaurants: [],         // Array of restaurant objects
    count: 0,                // Total restaurant count
    loading: false,          // Loading state
    error: null,             // Error state
    showVegOnly: false,      // Veg filter toggle
    pureVegRestaurantsCount: 0,
    creating: false,         // Create restaurant loading
    createError: null,
    deleting: false,
    deleteError: null,
  },
  menus: {
    menus: [],               // Menu array with categories
    menuId: null,            // Current menu ID
    newMenu: null,           // Recently created menu
    updatedMenu: null,       // Recently updated menu
    loading: false,
    error: null,
    creating: false,
    createError: null,
    addingItem: false,
    addError: null,
  },
  user: {
    user: null,              // Current user object
    loading: false,
    isAuthenticated: false,  // Auth status
    error: null,
    isUpdated: false,
    Message: null,
    success: null,
  },
  cart: {
    cartItem: [],            // Items in cart
    loading: false,
    resturant: {},           // Associated restaurant
    deliveryInfo: {          // Shipping details
      address: "",
      city: "",
      postalCode: "",
      phone: "",
    },
    error: null,
  },
  orders: {
    orders: [],              // User's orders
    order: null,             // Single order detail
    loading: false,
    error: null,
    creating: false,
    createError: null,
  },
}
```

#### Redux Data Flow

```
User Action (e.g., clicking "Add to Cart")
        │
        ▼
dispatch(addToCart(foodItemId, quantity, restaurantId))
        │
        ▼
Redux Async Thunk Action (cartActions.js)
        │
        ▼
Axios API call → POST /api/v1/cart
        │
        ▼
Express Controller (cartController.js)
        │
        ▼
MongoDB Cart Model (Create/Update)
        │
        ▼
Response sent back to client
        │
        ▼
Dispatch cartSuccess(cartData) → cartSlice reducer updates state
        │
        ▼
React component re-renders with new cart state
```

### Backend Architecture

#### Middleware Pipeline

```
Request → CORS → JSON Parser → Cookie Parser → Logger → Route Handler → Error Middleware → Response
```

1. **CORS** — `cors({ origin: "http://localhost:5173", credentials: true })`
2. **express.json** — Parses JSON bodies with 30kb limit
3. **express.urlencoded** — Parses URL-encoded bodies
4. **cookie-parser** — Parses cookies from request headers
5. **Request Logger** — Logs method and path for debugging
6. **Route Handler** — Matched route with optional auth middleware
7. **Error Middleware** — Global error handler (CastError, ValidationError, Duplicate Key, JWT errors)

#### Authentication Flow

```
                    ┌──────────┐
                    │  Signup  │
                    └────┬─────┘
                         │ User.create({name, email, password, ...})
                         │ bcrypt.hash(password, 12)
                         ▼
                    ┌──────────┐
                    │  Login   │
                    └────┬─────┘
                         │ User.findOne({email}).select("+password")
                         │ bcrypt.compare(candidatePassword, userPassword)
                         ▼
                    ┌──────────────┐
                    │  JWT Issued  │
                    │  httpOnly    │
                    │  Cookie      │
                    └──────┬───────┘
                           │
              ┌────────────▼────────────┐
              │  Protected Routes       │
              │  isAuthenticatedUser    │
              │  ↓                      │
              │  Read jwt cookie        │
              │  jwt.verify(token)      │
              │  User.findById(decoded) │
              │  req.user = user        │
              └─────────────────────────┘
```

---

## 5. Full Stack Web Development & MERN Stack

### MongoDB — NoSQL Database

MongoDB is used as the primary database with Mongoose ODM for schema-based modeling.

#### Collections & Schemas

| Collection | Key Fields | Relationships |
|---|---|---|
| **User** | name, email, password (hashed), phoneNumber, role, avatar, passwordResetToken | Referenced by Cart, Order |
| **Restaurant** | name, isVeg, address, location (2dsphere), ratings, numOfReviews, reviews[], images[], reviewSentiment, reviewSummaryBullets[] | Referenced by Menu, Cart, FoodItem |
| **Menu** | menu[{category, items[ObjectId]}], restaurant | References Restaurant, FoodItem |
| **FoodItem** | name, price, description, ratings, images[], menu, stock, restaurant, reviews[] | References Menu, Restaurant |
| **Cart** | user, restaurant, foodItems[{foodItem, quantity}] | References User, Restaurant, FoodItem |
| **Order** | shippingInfo, user, orderItems[], restaurant, paymentInfo{sessionId, status}, itemsPrice, deliveryPrice, totalPrice, orderStatus | References User, Restaurant, FoodItem |
| **Coupon** | couponName, subTitle, minAmount, maxDiscount, discount, details, expire | Standalone |

#### MongoDB Features Used

- **2dsphere Geospatial Index** on `Restaurant.location` for location-based queries
- **Text Index** on `Restaurant.address` for full-text search
- **Aggregation Pipeline** in Coupon validation — uses `$addFields`, `$cond`, `$subtract`, `$min`, `$multiply`, `$divide`, `$concat`, `$project` to compute discount totals
- **Embedded Documents** — Reviews within Restaurant, orderItems within Order, foodItems within Cart
- **Referenced Documents** — Menu items reference FoodItem via ObjectId with `.populate()`

### Express.js — RESTful API Framework

Express 5 powers the backend with modular routing.

#### Architecture Pattern

```
app.js (entry point, middleware, route mounting)
  │
  ├── routes/        (define HTTP methods and paths)
  │     └── auth.js, restaurant.js, cart.js, order.js, payment.js, couponRoutes.js, ai.routes.js, foodItem.js, menu.js
  │
  ├── controllers/   (handler functions with business logic)
  │     └── authController.js, restaurantController.js, cartController.js, orderController.js, paymentController.js, couponController.js, aiController.js, foodItemController.js, menuController.js
  │
  ├── models/        (Mongoose schemas)
  │     └── user.js, restaurant.js, cartModel.js, order.js, couponModel.js, foodItem.js, menu.js
  │
  ├── services/      (external API integrations)
  │     └── ai.service.js, aiReviewAnalyzer.js, recipeService.js
  │
  ├── middlewares/    (request processing pipeline)
  │     └── auth.js, authorizeRoles.js, catchAsyncErrors.js, errors.js
  │
  └── utils/         (helper functions)
        └── errorHandler.js, sendToken.js, apiFeatures.js, email.js, seeder.js
```

#### Custom Middleware

- **catchAsyncErrors** — Wraps async route handlers to catch promise rejections and forward to error middleware
- **isAuthenticatedUser** — Verifies JWT from httpOnly cookie, attaches user to `req.user`
- **authorizeRoles** — Restricts access based on user role (`user` / `admin`)
- **errorMiddleware** — Global error handler with environment-aware responses (development shows full stack trace)

### React.js — Component-Based UI

React 18 drives the frontend with a component-based architecture.

#### Key React Patterns Used

1. **Functional Components with Hooks** — All components use `useState`, `useEffect`, `useDispatch`, `useSelector`, `useNavigate`, `useParams`
2. **React Router v7** — SPA navigation with route parameters (`:id`, `:keyword`), programmatic navigation via `useNavigate`
3. **Redux Hooks** — `useDispatch()` for dispatching actions, `useSelector()` for reading state
4. **Lifecycle with useEffect** — Data fetching on mount, cleanup on unmount
5. **Conditional Rendering** — Loading spinners, error messages, auth-gated content
6. **Form Handling** — Controlled inputs with state, validation, and submission handlers

#### Styling Approach

- **React-Bootstrap** — Grid system, components (Container, Row, Col, Card, Button, Modal, Form)
- **Custom CSS** — `App.css` and `index.css` for global styles
- **Font Awesome** — Icons via `@fortawesome/react-fontawesome`
- **react-toastify** — Toast notification popups for success/error feedback
- **styled-components** — For component-specific styling

### Node.js — Server-Side Runtime

Node.js with ES Modules (`"type": "module"` in package.json) provides the backend runtime.

#### Key Server Configuration

```
server.js
  │
  ├── dotenv.config({ path: "./config/config.env" })
  ├── connectDatabase()  ← mongoose.connect(process.env.DB_URI)
  └── app.listen(PORT, '0.0.0.0')
```

#### Vite Proxy Configuration

```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

This means during development, the frontend at `localhost:5173` proxies all `/api/*` requests to `localhost:8080`, avoiding CORS issues in development.

---

## 6. Implementation Details

### 6.1 Authentication System

**File:** `backend/controllers/authController.js`, `backend/middlewares/auth.js`

```
┌────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                          │
│                                                                │
│  Signup:                                                       │
│    Client → POST /api/v1/users/signup                         │
│           → { name, email, password, passwordConfirm, phone }  │
│           → Cloudinary avatar upload (optional)                │
│           → User.create() → pre-save hook hashes password      │
│           → sendToken() → JWT created → httpOnly cookie set    │
│           → Response: { success, token, user }                 │
│                                                                │
│  Login:                                                        │
│    Client → POST /api/v1/users/login                           │
│           → { email, password }                                │
│           → User.findOne({email}).select("+password")          │
│           → bcrypt.compare(password, user.password)            │
│           → sendToken() → httpOnly cookie                      │
│                                                                │
│  Protected Route Access:                                       │
│    Request → isAuthenticatedUser middleware                    │
│           → Read jwt from req.cookies                          │
│           → jwt.verify(token, JWT_SECRET)                      │
│           → User.findById(decoded.id)                          │
│           → req.user = user → next()                           │
└────────────────────────────────────────────────────────────────┘
```

**Security Features:**
- Passwords hashed with bcrypt at cost factor 12
- JWT stored in httpOnly cookie (not accessible via JavaScript)
- Password confirmation validation at schema level
- `password` field excluded from query results (`select: false`)
- `passwordChangedAt` field enables token invalidation after password change
- Role-based authorization (`authorizeRoles("admin")`)

### 6.2 Cart System

**File:** `backend/controllers/cartController.js`, `frontend/src/redux/slices/cartSlice.js`

The cart uses a hybrid approach:
1. **Redux State** — Cart items stored in the `cartSlice` for instant UI updates
2. **MongoDB Persistence** — Cart is saved per user per restaurant in the `Cart` collection

```
┌────────────────────────────────────────────────────────────────┐
│                    Cart Data Flow                              │
│                                                                │
│  Add to Cart:                                                  │
│    dispatch(addToCart(foodItemId, quantity, restaurantId))     │
│    → Axios POST /api/v1/cart                                   │
│    → Cart.findOne({ user, restaurant })                        │
│    → If cart exists: update existing item or push new          │
│    → If no cart: create new cart document                      │
│    → Populate foodItems.foodItem references                    │
│    → Response: { status: "Success", data: cart }              │
│    → dispatch(cartSuccess(cart)) → state updated               │
│                                                                │
│  Cart Operations:                                              │
│    GET /api/v1/cart           → Get cart by user+restaurant    │
│    PUT /api/v1/cart/item/:id  → Update item quantity           │
│    DELETE /api/v1/cart/item/:id → Remove item from cart        │
│    DELETE /api/v1/cart/clear/:restaurantId → Clear entire cart  │
└────────────────────────────────────────────────────────────────┘
```

**Edge Cases Handled:**
- Insufficient stock validation before adding to cart
- Quantity minimum check (must be ≥ 1)
- Auto-delete cart document when all items removed
- Cross-restaurant separation (cart scoped by restaurant)

### 6.3 Payment Processing (Stripe)

**File:** `backend/controllers/paymentController.js`, `frontend/src/Components/Payment.jsx`

```
┌────────────────────────────────────────────────────────────────┐
│                    Stripe Payment Flow                         │
│                                                                │
│  1. Client requests Stripe publishable key                     │
│     → GET /api/v1/payment/stripeapikey                        │
│     → Response: { stripeApiKey }                               │
│                                                                │
│  2. Client loads Stripe Elements with publishable key          │
│                                                                │
│  3. User clicks "Pay" → Client sends items to backend:         │
│     → POST /api/v1/payment/process                            │
│     → Body: { items, currency, shippingCountry }               │
│     → Backend creates Stripe Checkout Session:                 │
│       ├── line_items: map items to price_data objects          │
│       ├── mode: "payment"                                      │
│       ├── shipping_address_collection                          │
│       ├── shipping_options (delivery charges)                  │
│       ├── success_url → /success?session_id={CHECKOUT_ID}     │
│       └── cancel_url → /cart                                  │
│     → Response: { url: session.url } → redirect to Stripe     │
│                                                                │
│  4. User completes payment on Stripe hosted page               │
│                                                                │
│  5. Stripe redirects to /success with session_id               │
│     → OrderSuccess component displays confirmation             │
│     → Order created in database via POST /api/v1/orders       │
└────────────────────────────────────────────────────────────────┘
```

**Supported Currencies:** USD, CAD, GBP, EUR, INR, AUD, JPY, and 40+ more  
**Delivery Fee:** Configurable via `DELIVERY_AMOUNT` env variable (default: 500 cents)  
**Allowed Countries:** Configurable via `ALLOWED_COUNTRIES` env variable (defaults to 48 Stripe-supported countries)

### 6.4 AI Integration (Groq API)

**File:** `backend/services/ai.service.js`, `backend/services/aiReviewAnalyzer.js`, `backend/services/recipeService.js`, `backend/controllers/aiController.js`

```
┌────────────────────────────────────────────────────────────────┐
│                    AI Service Architecture                     │
│                                                                │
│  All AI features use Groq API with LLaMA 3.1-8B-Instruct      │
│  (or LLaMA 3.1-70B where applicable)                          │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  AI Service Layer (backend/services/)                    │   │
│  │                                                         │   │
│  │  ai.service.js           aiReviewAnalyzer.js  recipeService.js│
│  │  ┌─────────────────┐    ┌────────────────┐    ┌───────────┐ │
│  │  │ generateDish    │    │ analyzeReviews │    │ generate  │ │
│  │  │ Description()   │    │ WithAI()       │    │ Recipe()  │ │
│  │  └────────┬────────┘    └───────┬────────┘    └─────┬─────┘ │
│  │           │                     │                   │        │
│  │           ▼                     ▼                   ▼        │
│  │     POST api.groq.com/v1/chat/completions                   │
│  │     Headers: Authorization = Bearer ${GROQ_API_KEY}        │
│  │     Body: { model, messages, temperature, max_tokens }     │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Endpoints:                                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ POST /api/v1/ai/generate-food-ai                       │    │
│  │   Body: { name, category, spiceLevel, price }          │    │
│  │   Returns: { description, tags[], allergens[],        │    │
│  │             serves, bestFor[] }                        │    │
│  │                                                        │    │
│  │ POST /api/v1/ai/generate-food-ai/:foodId               │    │
│  │   Generates and saves AI metadata to food item doc     │    │
│  │                                                        │    │
│  │ POST /api/v1/ai/recipe/generate                        │    │
│  │   Body: { ingredients }                                │    │
│  │   Returns: { recipe, source }                          │    │
│  │                                                        │    │
│  │ PUT /api/v1/ai/admin/restaurants/:id/analyze           │    │
│  │   Analyzes all reviews for sentiment, summaries,       │    │
│  │   and top mentions → saves to restaurant doc           │    │
│  │                                                        │    │
│  │ PUT /api/v1/ai/stores/:id/review                       │    │
│  │   Adds a review + triggers AI analysis automatically   │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

#### Dish Description Generation (ai.service.js)

**Prompt Engineering:**
```
Generate ONLY valid JSON.
No markdown. No explanation text.

Dish Name: ${name}
Category: ${category}
Spice Level: ${spiceLevel}
Base Price: ${price}

Return JSON:
{
  "description": "string",
  "tags": ["string"],
  "allergens": ["string"],
  "serves": "string",
  "bestFor": ["string"]
}
```

**Model:** `llama-3.1-8b-instant`, **Temperature:** 0.4, **Max Tokens:** 300

#### Review Sentiment Analysis (aiReviewAnalyzer.js)

**Prompt:** Analyzes all restaurant reviews together and returns:
- `sentiment`: "positive", "negative", or "mixed"
- `summaryBullets`: Array of 3+ summary points
- `topMentions`: Array of frequently mentioned keywords

**Fallback:** If JSON parsing fails or API errors occur, returns default values `{ sentiment: "mixed", summaryBullets: ["AI summary unavailable"], topMentions: [] }`

#### Recipe Generation (recipeService.js)

**Prompt:**
```
Create a simple recipe using these ingredients: ${ingredients}

Format the response with:
- Recipe Name
- Ingredients list
- Step-by-step instructions
- Cooking time
```

**Model:** `llama-3.1-8b-instant`, **Temperature:** 0.5, **Max Tokens:** 600

### 6.5 Coupon System

**File:** `backend/controllers/couponController.js`, `backend/models/couponModel.js`

The coupon validation uses a **MongoDB Aggregation Pipeline** for computation:

```javascript
Coupon.aggregate([
  { $addFields: {
      finalTotal: {
        $cond: [
          { $gte: [cartItemsTotalAmount, "$minAmount"] },
          { $subtract: [
              cartItemsTotalAmount,
              { $min: [
                  { $multiply: [cartItemsTotalAmount, { $divide: ["$discount", 100] }] },
                  "$maxDiscount",
              ]},
          ]},
          cartItemsTotalAmount,
        ]
      },
      message: {
        $cond: [
          { $gte: [cartItemsTotalAmount, "$minAmount"] },
          "",
          { $concat: ["add ₹ ", { $toString: { $subtract: ["$minAmount", cartItemsTotalAmount] } }, " more to avail this offer"] },
        ]
      },
  }},
  { $project: { subTitle: 1, couponName: 1, details: 1, minAmount: 1, finalTotal: 1, message: 1 }},
])
```

**Logic:** If cart total ≥ minimum amount, apply percentage discount (capped at maxDiscount). Otherwise, show how much more the user needs to spend.

### 6.6 Seed Data

**File:** `backend/utils/seeder.js`, `backend/utils/restaurantSeeder.js`, `backend/utils/menuSeeder.js`

The project includes comprehensive seed scripts:

- **Restaurants:** 100+ restaurants across 8 cuisines with names, addresses, geolocation coordinates, ratings, images, and reviews
- **Food Items:** Hundreds of food items with names, prices, descriptions, categories, stock levels, and images
- **Menus:** Organized by categories (e.g., "Starters", "Main Course", "Desserts", "Beverages")

Run with:
```bash
npm run seed          # Seed food items
npm run seed:restaurants  # Seed restaurants
```

---

## 7. Folder Structure

```
Food_Delivery_Website/
│
├── backend/
│   ├── config/
│   │   ├── config.env              # Environment variables (gitignored)
│   │   ├── .env.example            # Environment variable template
│   │   ├── database.js             # MongoDB connection setup
│   │   └── cloudinary.js           # Cloudinary configuration
│   │
│   ├── controllers/
│   │   ├── authController.js       # Signup, login, logout, profile update, account deletion
│   │   ├── restaurantController.js # CRUD for restaurants
│   │   ├── menuController.js       # Menu CRUD, add items to menus
│   │   ├── foodItemController.js   # Food item CRUD
│   │   ├── cartController.js       # Add/update/remove/clear cart items
│   │   ├── orderController.js      # Create order, get orders, update status
│   │   ├── paymentController.js    # Stripe Checkout session creation
│   │   ├── couponController.js     # Coupon CRUD + validation with aggregation
│   │   └── aiController.js         # AI food generation, recipe, review analysis
│   │
│   ├── middlewares/
│   │   ├── auth.js                 # JWT verification (isAuthenticatedUser)
│   │   ├── authorizeRoles.js       # Role-based access control
│   │   ├── catchAsyncErrors.js     # Async error wrapper
│   │   └── errors.js              # Global error handler
│   │
│   ├── models/
│   │   ├── user.js                 # User schema with password hashing
│   │   ├── restaurant.js           # Restaurant schema with geospatial index
│   │   ├── menu.js                 # Menu schema with categorized items
│   │   ├── foodItem.js             # Food item schema with reviews
│   │   ├── cartModel.js            # Cart schema per user per restaurant
│   │   ├── order.js                # Order schema with shipping/payment
│   │   └── couponModel.js          # Coupon schema with discount rules
│   │
│   ├── routes/
│   │   ├── auth.js                 # POST /signup, /login, GET/PUT /me, POST /logout
│   │   ├── restaurant.js           # GET/POST /, GET/DELETE /:storeId, /:storeId/menus
│   │   ├── menu.js                 # GET/POST /, PATCH /:menuId/addItem, DELETE /:menuId
│   │   ├── foodItem.js             # POST /item, GET /items/:storeId, PATCH/DELETE /item/:foodId
│   │   ├── cart.js                 # POST/GET /, PUT/DELETE /item/:id, DELETE /clear/:restaurantId
│   │   ├── order.js                # POST/GET /, GET /:id, GET /admin/all, PUT /admin/:id
│   │   ├── payment.js              # POST /process, GET /stripeapikey
│   │   ├── couponRoutes.js         # POST/GET /, PATCH/DELETE /:couponId, POST /validate
│   │   └── ai.routes.js            # POST /generate-food-ai, /recipe/generate, PUT /stores/:id/review
│   │
│   ├── services/
│   │   ├── ai.service.js           # Groq API for dish descriptions
│   │   ├── aiReviewAnalyzer.js     # Groq API for review sentiment analysis
│   │   └── recipeService.js        # Groq API for recipe generation
│   │
│   ├── utils/
│   │   ├── errorHandler.js         # Custom ErrorHandler class
│   │   ├── sendToken.js            # JWT creation + cookie response helper
│   │   ├── apiFeatures.js          # API query features (search, sort)
│   │   ├── email.js                # Nodemailer email sender
│   │   ├── seeder.js               # Food items seed script
│   │   ├── restaurantSeeder.js     # Restaurants seed script
│   │   └── menuSeeder.js           # Menu seed script
│   │
│   ├── views/                      # Pug email templates
│   │   ├── baseEmail.pug           # Base template
│   │   ├── passwordReset.pug       # Password reset email
│   │   ├── welcome.pug             # Welcome email
│   │   └── style.css               # Email styles
│   │
│   ├── data/
│   │   ├── restaurants.json        # Restaurant seed data (100+ entries)
│   │   └── foodItem.json           # Food item seed data
│   │
│   ├── tests/
│   │   ├── setup.js                # Test setup
│   │   ├── auth.test.js            # Auth endpoint tests
│   │   └── restaurant.test.js      # Restaurant endpoint tests
│   │
│   ├── app.js                      # Express app setup, middleware, route mounting
│   ├── server.js                   # Server entry point, DB connection
│   ├── Dockerfile                  # Multi-stage Docker build
│   ├── package.json                # Dependencies and scripts
│   └── vitest.config.js            # Test runner configuration
│
├── frontend/
│   ├── public/
│   │   └── images/                 # Static images
│   │
│   ├── src/
│   │   ├── Components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx      # Top navigation bar
│   │   │   │   ├── Footer.jsx      # Page footer
│   │   │   │   ├── Loader.jsx      # Loading spinner
│   │   │   │   └── Search.jsx      # Search input component
│   │   │   │
│   │   │   ├── Home.jsx            # Restaurant listing page
│   │   │   ├── Restaurant.jsx      # Individual restaurant card
│   │   │   ├── CountRestaurant.jsx # Restaurant count + filters
│   │   │   ├── Menu.jsx            # Restaurant menu display
│   │   │   ├── Fooditem.jsx        # Individual food item card
│   │   │   ├── Cart.jsx            # Shopping cart page
│   │   │   ├── Login.jsx           # Login form
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── Profile.jsx         # User profile page
│   │   │   ├── UpdateProfile.jsx   # Edit profile form
│   │   │   ├── Shipping.jsx        # Shipping address form
│   │   │   ├── ConfirmOrder.jsx    # Order review and confirmation
│   │   │   ├── Payment.jsx         # Stripe payment integration
│   │   │   ├── OrderSuccess.jsx    # Order success confirmation
│   │   │   ├── MyOrders.jsx        # Order history list
│   │   │   ├── OrderDetails.jsx    # Single order details
│   │   │   ├── ForgotPassword.jsx  # Password reset request
│   │   │   ├── RecipeGenerator.jsx # AI recipe generator UI
│   │   │   └── Message.jsx         # Message display component
│   │   │
│   │   ├── redux/
│   │   │   ├── store.js            # Redux store configuration
│   │   │   ├── slices/
│   │   │   │   ├── userSlice.js    # User state (auth, profile)
│   │   │   │   ├── cartSlice.js    # Cart state (items, delivery info)
│   │   │   │   ├── orderSlice.js   # Orders state (list, detail)
│   │   │   │   ├── restaurantSlice.js # Restaurant state (list, filters)
│   │   │   │   └── menuSlice.js    # Menu state (menus, items)
│   │   │   └── actions/
│   │   │       ├── userActions.js      # Login, signup, logout, loadUser thunks
│   │   │       ├── cartActions.js      # Add/remove/update cart thunks
│   │   │       ├── orderActions.js     # Create/get orders thunks
│   │   │       ├── restaurantAction.js # Get/create/delete restaurants thunks
│   │   │       └── menuActions.js      # Get/create menus thunks
│   │   │
│   │   ├── utils/
│   │   │   └── api.js              # Axios instance with interceptors
│   │   │
│   │   ├── App.jsx                 # Root component with routes
│   │   ├── App.css                 # Global styles
│   │   ├── index.css               # Base styles
│   │   └── main.jsx               # React entry point with Redux Provider
│   │
│   ├── __tests__/
│   │   ├── setup.js                # Test setup
│   │   └── App.test.jsx            # App component tests
│   │
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite config with proxy
│   ├── vercel.json                 # Vercel deployment config
│   ├── Dockerfile                  # Nginx-based production build
│   ├── nginx.conf                  # Nginx configuration
│   ├── eslint.config.js            # ESLint configuration
│   ├── package.json                # Dependencies and scripts
│   └── vitest.config.js            # Test runner configuration
│
├── .github/
│   └── workflows/                  # GitHub Actions CI/CD pipelines
│
├── docker-compose.yml              # Multi-container orchestration
├── .gitignore
└── README.md                       # Project documentation
```

---

## 8. API Endpoints

### Authentication — `/api/v1/users`

| Method | Endpoint | Auth | Description | Request Body | Response |
|---|---|---|---|---|---|
| `POST` | `/signup` | No | Register a new user | `{ name, email, password, passwordConfirm, phoneNumber, avatar? }` | `{ success, token, data: { user } }` |
| `POST` | `/login` | No | Login user | `{ email, password }` | `{ success, token, data: { user } }` |
| `GET` | `/me` | Yes | Get current user profile | — | `{ success, data: { user } }` |
| `PUT` | `/me` | Yes | Update profile | `{ name?, email?, phoneNumber?, avatar? }` | `{ success, data: { user } }` |
| `POST` | `/logout` | Yes | Logout (clear cookie) | — | `{ success, message }` |
| `DELETE` | `/me` | Yes | Delete account (with cart & orders) | — | `{ success, message }` |

### Restaurants — `/api/v1/eats/stores`

| Method | Endpoint | Auth | Description | Query/Params | Response |
|---|---|---|---|---|---|
| `GET` | `/` | No | List all restaurants | `?keyword=&sort=` | `{ status, count, data: [restaurants] }` |
| `POST` | `/` | No | Create restaurant | Body: `{ name, address, ... }` | `{ status, data: restaurant }` |
| `GET` | `/:storeId` | No | Get single restaurant | — | `{ status, data: restaurant }` |
| `DELETE` | `/:storeId` | No | Delete restaurant | — | `{ status, message }` |
| `GET` | `/:storeId/menus` | No | Get menus for restaurant | — | `{ status, data: [menus] }` |
| `POST` | `/:storeId/menus` | No | Create menu for restaurant | `{ menu: [{ category, items }] }` | `{ status, data: menu }` |
| `PATCH` | `/:storeId/menus/:menuId/addItem` | No | Add item to menu | `{ category, foodItemId }` | `{ status, data: menu }` |

### Food Items — `/api/v1/eats`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/item` | Admin | Create a new food item |
| `GET` | `/items/:storeId` | No | Get all food items for a store |
| `GET` | `/item/:foodId` | No | Get single food item |
| `PATCH` | `/item/:foodId` | Admin | Update food item |
| `DELETE` | `/item/:foodId` | Admin | Delete food item |

### Menus (Admin) — `/api/v1/eats/menus`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | No | Get all menus for a store |
| `POST` | `/` | Admin | Create a new menu |
| `PATCH` | `/:menuId/addItem` | Admin | Add food item to menu |
| `DELETE` | `/:menuId` | Admin | Delete a menu |

### Cart — `/api/v1/cart`

| Method | Endpoint | Auth | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/` | Yes | Add item to cart | `{ foodItemId, quantity, restaurantId }` |
| `GET` | `/` | Yes | Get user's cart | `?restaurantId=` |
| `PUT` | `/item/:foodItemId` | Yes | Update item quantity | `{ quantity }` |
| `DELETE` | `/item/:foodItemId` | Yes | Remove item from cart | — |
| `DELETE` | `/clear/:restaurantId` | Yes | Clear cart for restaurant | — |

### Orders — `/api/v1/orders`

| Method | Endpoint | Auth | Role | Description | Request Body |
|---|---|---|---|---|---|
| `POST` | `/` | Yes | User | Create new order | `{ shippingInfo, orderItems, restaurant, paymentInfo, itemsPrice, deliveryPrice, totalPrice }` |
| `GET` | `/` | Yes | User | Get my orders | — |
| `GET` | `/:id` | Yes | User | Get order details | — |
| `GET` | `/admin/all` | Yes | Admin | Get all orders | — |
| `PUT` | `/admin/:id` | Yes | Admin | Update order status | `{ status }` |

### Payment — `/api/v1/payment`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/process` | Yes | Create Stripe Checkout Session |
| `GET` | `/stripeapikey` | Yes | Get Stripe publishable key |

### Coupons — `/api/v1/coupon`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | — | Create a new coupon |
| `GET` | `/` | — | Get all coupons |
| `PATCH` | `/:couponId` | — | Update a coupon |
| `DELETE` | `/:couponId` | — | Delete a coupon |
| `POST` | `/validate` | — | Validate coupon against cart total |

### AI — `/api/v1/ai`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/generate-food-ai` | No | Generate dish descriptions using Groq AI |
| `POST` | `/generate-food-ai/:foodId` | No | Generate and save AI metadata to food item |
| `PUT` | `/admin/restaurants/:id/analyze` | No | Analyze restaurant reviews with AI |
| `PUT` | `/stores/:id/review` | No | Add a review + trigger AI analysis |
| `POST` | `/recipe/generate` | No | Generate recipe from ingredients |

### Utility

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/test` | No | Health check — returns `{ message: "Server is working" }` |

---

## 9. Data Flow

### Complete User Journey

```
                    ┌─────────────────────────────────────┐
                    │         USER JOURNEY FLOW            │
                    └─────────────────────────────────────┘

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  VISIT   │────►│  BROWSE  │────►│  VIEW    │────►│ ADD TO   │
    │  HOME    │     │RESTAURANT│     │  MENU    │     │  CART    │
    │  PAGE    │     │  CARDS   │     │(CATEGORY)│     │          │
    └──────────┘     └──────────┘     └──────────┘     └────┬─────┘
         │                                                   │
         │  (Search by                                      │
         │   keyword)                                       │
         ▼                                                   │
    ┌──────────┐                                             │
    │ SEARCH   │                                             │
    │ RESULTS  │                                             │
    └──────────┘                                             │
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │  VIEW CART /    │
                                                    │  CHECKOUT       │
                                                    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │  SHIPPING       │
                                                    │  ADDRESS FORM   │
                                                    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │  CONFIRM ORDER  │
                                                    │  (Review Items) │
                                                    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │  STRIPE PAYMENT │
                                                    │  (Checkout Page)│
                                                    └────────┬─────────┘
                                                             │
                                              (Success)      │ (Cancel)
                                                             ▼
                                                    ┌──────────────────┐
                                                    │ ORDER SUCCESS /  │
                                                    │ CONFIRMATION     │
                                                    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │  MY ORDERS      │
                                                    │  (Order History) │
                                                    └──────────────────┘
```

### Detailed Data Flow Per Feature

#### Restaurant Browsing Flow
```
1. User visits Home page
2. Home component mounts → dispatch(getRestaurants(keyword))
3. restaurantAction.js → Axios GET /api/v1/eats/stores?keyword=
4. Backend: APIFeatures.search() → Restaurant.find() with regex on name/address
5. Response: { status, count, data: [restaurants] }
6. dispatch(getRestaurantSuccess({ restaurants, count })) → state updated
7. Restaurant cards render with name, address, rating, reviews count, images
8. User can toggle "Veg Only" filter (dispatch(toggleVegOnly()))
9. User can sort by ratings (dispatch(sortByRatings())) or reviews (dispatch(sortByReviews()))
```

#### Menu Browsing Flow
```
1. User clicks on a restaurant card → navigate to /eats/stores/:id/menus
2. Menu component mounts → dispatch(getMenus(storeId))
3. menuActions.js → Axios GET /api/v1/eats/stores/:storeId/menus
4. Backend: Menu.find({ restaurant: storeId }).populate("menu.items")
5. Response: { status, data: [menus] } — each menu has categories with populated food items
6. dispatch(getMenusSuccess({ menu, menuId })) → state updated
7. Menu renders by category (Starters, Main Course, Desserts, etc.)
8. Each food item shows name, price, description, image, "Add to Cart" button
```

#### Order Placement Flow
```
1. User adds items to cart → cart stored in Redux + MongoDB
2. User clicks "Proceed to Checkout" → need auth check
3. If not logged in → redirect to /login
4. If logged in → /shipping → fill address, city, postal code, phone
5. dispatch(saveDeliveryInfo(deliveryInfo)) → stored in Redux
6. Navigate to /order/confirm → review items, delivery info, total
7. Click "Proceed to Payment"
8. Payment component:
   a. GET /api/v1/payment/stripeapikey → load Stripe Elements
   b. Click "Pay" → POST /api/v1/payment/process → get Stripe session URL
   c. window.location.href = session.url → redirect to Stripe Checkout
9. User completes payment on Stripe
10. Stripe redirects to /success?session_id=xxx
11. OrderSuccess component:
    a. POST /api/v1/orders → { shippingInfo, orderItems, restaurant, paymentInfo, ... }
    b. Order created with status "processing"
    c. Cart cleared from Redux and MongoDB
    d. Success message displayed
12. User can view order at /orders → GET /api/v1/orders
13. Click on order → /order/:id → GET /api/v1/orders/:id → full details
```

#### AI Recipe Generation Flow
```
1. User navigates to /ai/recipe → RecipeGenerator component
2. User types ingredients in textarea (e.g., "chicken, rice, tomatoes, garlic")
3. Click "Generate Recipe"
4. Axios POST /api/v1/ai/recipe/generate → { ingredients }
5. Backend controller → recipeService.generateRecipe(ingredients)
6. Groq API called with prompt containing ingredients
7. LLaMA 3.1 generates recipe with name, ingredients, steps, cooking time
8. Response: { recipe, source: "Groq AI (LLaMA 3.1)" }
9. Recipe displayed in formatted card with sections
```

---

## 10. Conclusion

### What Was Built

FoodJenie is a **production-ready food delivery platform** built entirely from scratch using the MERN stack. The application successfully demonstrates:

| Area | Achievement |
|---|---|
| **Full-Stack Development** | Complete separation of frontend (React + Vite) and backend (Express + MongoDB) with API-driven communication |
| **Authentication** | Secure JWT-based auth with httpOnly cookies, bcrypt password hashing, and role-based access control |
| **Payment Processing** | Real Stripe Checkout integration with line items, shipping address, delivery fees, and multi-currency support |
| **AI Integration** | Three distinct AI features powered by Groq's LLaMA 3.1 — dish descriptions, recipe generation, and review sentiment analysis |
| **State Management** | Five Redux Toolkit slices managing restaurants, menus, user, cart, and orders with async thunk actions |
| **Database Design** | Seven Mongoose schemas with embedded documents, references, geospatial indexing, and aggregation pipelines |
| **UI/UX** | Responsive React-Bootstrap interface with 20+ components, toast notifications, and dynamic routing |
| **DevOps** | Docker containerization, docker-compose orchestration, and ESLint code quality tooling |

### Key Lessons Learned

1. **MERN Stack Architecture** — Understanding how React's component model, Redux's unidirectional data flow, Express's middleware pipeline, and MongoDB's document model fit together in a cohesive system
2. **Security Best Practices** — Implementing httpOnly cookies for JWT storage, password hashing with bcrypt, input validation, and role-based authorization
3. **Third-Party API Integration** — Working with Stripe's Checkout Sessions API and Groq's LLM API, handling proxy configurations, error responses, and fallback strategies
4. **Database Design Trade-offs** — Deciding between embedded vs. referenced documents, when to use aggregation pipelines vs. application-level computation
5. **State Management Patterns** — Organizing Redux state into domain-specific slices, separating actions from reducers, handling loading/error/success states
6. **Dev Workflow** — Leveraging Vite's hot module replacement for rapid development, Docker for consistent environments, and environment variable configuration

### Future Enhancements

- **Real-Time Order Tracking** — WebSocket integration for live delivery status updates
- **Mobile App** — React Native cross-platform mobile application
- **Admin Dashboard** — Comprehensive admin panel with analytics, restaurant management, and order monitoring
- **Rating & Review System** — Enhanced review UI with photo uploads and verified purchase badges
- **Push Notifications** — Order status notifications via email/SMS
- **Load Testing** — Performance optimization with caching (Redis) and CDN integration
- **CI/CD Pipeline** — Automated testing, building, and deployment via GitHub Actions

### Final Thoughts

This internship project transformed theoretical MERN stack knowledge into a practical, working application. Every layer — from the MongoDB schema design to the React component tree, from the Stripe integration to the AI service layer — was implemented with production-grade patterns and practices. FoodJenie stands as a testament to the power of the MERN stack for building modern, full-stack web applications.

---

*Built with the MERN Stack — MongoDB, Express.js, React, Node.js*
*AI Powered by Groq (LLaMA 3.1)*
*Payments by Stripe*
