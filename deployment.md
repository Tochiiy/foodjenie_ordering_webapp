# FoodJenie — Deployment Guide

> Deploy the FoodJenie food delivery app to **Vercel** (frontend) and **Render** (backend) with MongoDB Atlas, Stripe, Cloudinary, and Groq AI.

---

## Section 1: Prerequisites

Before you begin, ensure you have the following:

| Requirement | Details |
|-------------|---------|
| **Node.js** | v18 or higher |
| **Git** | Installed and configured |
| **GitHub account** | Repository pushed to GitHub |
| **Vercel account** | [vercel.com](https://vercel.com) — free tier |
| **Render account** | [render.com](https://render.com) — free tier |
| **MongoDB Atlas** | Cluster already created and running — connection string on hand |
| **Stripe account** | Test-mode keys available (`pk_test_...` / `sk_test_...`) |
| **Cloudinary account** | Cloud name, API key, and API secret available |
| **Groq API key** | API key for AI recipe/review features (`gsk_...`) |

---

## Section 2: Environment Variables

All environment variables are listed below. Copy the exact values from your project's `backend/config/config.env` and paste them into the Render dashboard.

### Backend (Render)

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | `8080` | Render will override with its own port via `$PORT` |
| `DB_URI` | `mongodb+srv://tochukwusun24_db_user:oipdJvXJdETkJ8rw@geniefooddelivery.mlaoeqj.mongodb.net/?appName=geniefoodDelivery` | MongoDB Atlas connection string |
| `JWT_SECRET` | `myINTERN2026pRoject12537` | JWT signing secret |
| `JWT_EXPIRES` | `7d` | Token expiry duration |
| `JWT_EXPIRES_TIME` | `90` | Legacy expiry (optional) |
| `CLOUDINARY_CLOUD_NAME` | `dzktlayuw` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `862468661719733` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `zMgfe2n9MEbAo3vn-j3RhhyhMQU` | Cloudinary API secret |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_51TQpaIPqoTyicRvOaYeyV5UCrJ2k34dDahcSQuNnF3EHQiUjrzkBh4fmPAN6WZAYzprZvQSkxIuZAzkBMEckwQvY00mIR0Mbo3` | Stripe publishable key (also needed on frontend) |
| `STRIPE_SECRET_KEY` | `sk_test_...` (paste from Stripe dashboard) | Stripe secret key |
| `DEFAULT_CURRENCY` | `usd` | Default currency for payments |
| `DELIVERY_AMOUNT` | `500` | Delivery fee in cents ($5.00) |
| `ALLOWED_COUNTRIES` | (leave empty or set to `US,CA`) | Comma-separated country codes |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | **Update after frontend deploy** |
| `GROQ_API_KEY` | `gsk_...` (paste from Groq console) | Groq AI API key |
| `HTTP_PROXY` | `http://14a0fa8168773:efed560f55@212.69.10.161:12323` | Proxy for AI API (if required) |
| `HTTPS_PROXY` | `http://14a0fa8168773:efed560f55@212.69.10.161:12323` | HTTPS proxy for AI API |

### Frontend (Vercel)

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Full URL of the Render backend (no trailing `/api`) |

**Important:** The frontend reads `VITE_API_URL` in `frontend/src/utils/api.js:4`. When defined, it prefixes all API calls with `${VITE_API_URL}/api`. When absent, it falls back to a relative `/api` path (useful only in dev with the Vite proxy).

---

## Section 3: Deploy Backend to Render

### Step 3.1 — Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

### Step 3.2 — Create a Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (grant Render access if prompted).
4. Configure the service:

| Field | Value |
|-------|-------|
| **Name** | `foodjenie-api` |
| **Region** | Choose the closest to your users (e.g., `Frankfurt` or `Ohio`) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or paid as needed) |

### Step 3.3 — Add Environment Variables

In the **Environment Variables** section, add **all** variables from the Backend table in Section 2. Copy values directly from `backend/config/config.env`.

> **Tip:** Mask the following as "secret" fields: `DB_URI`, `JWT_SECRET`, `CLOUDINARY_API_SECRET`, `STRIPE_SECRET_KEY`, `GROQ_API_KEY`.

### Step 3.4 — Deploy

Click **Create Web Service**. Render will:
- Install dependencies (`npm install`)
- Start the server (`npm start`)

Wait for the build to finish. Once complete, note the URL:
```
https://foodjenie-api.onrender.com
```

Test that the backend is alive:
```bash
curl https://foodjenie-api.onrender.com/test
# Expected: {"message":"Server is working"}
```

### Step 3.5 — Seed the Database (one-time)

After the service is live, run the seeders via Render's Shell tab or locally:

```bash
# Via Render Shell (dashboard → your service → Shell)
cd backend
node utils/seeder.js
node utils/restaurantSeeder.js
```

---

## Section 4: Deploy Frontend to Vercel

### Step 4.1 — Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** → **Project**.
3. Import your GitHub repository.

### Step 4.2 — Configure Project

| Field | Value |
|-------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Vite` (auto-detected) |
| **Build Command** | `vite build` (already in `vercel.json`) |
| **Output Directory** | `dist` |

### Step 4.3 — Add Environment Variable

Add the following environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://foodjenie-api.onrender.com` |

> No other `VITE_*` variables are required. The Stripe publishable key is fetched at runtime from the backend via `GET /api/v1/payment/stripeapikey`.

### Step 4.4 — Deploy

Click **Deploy**. Vercel will build and deploy the frontend. Once complete, note the URL:
```
https://<your-project-name>.vercel.app
```

### Step 4.5 — Link Backend to Frontend

1. Go back to **Render Dashboard** → your backend service → **Environment**.
2. Update `FRONTEND_URL`:
   - **Old:** `http://localhost:5173`
   - **New:** `https://<your-project-name>.vercel.app`
3. Click **Save Changes** → **Manual Deploy** → **Deploy latest commit**.

This ensures CORS and Stripe redirects point to the live frontend.

---

## Section 5: CI/CD Pipeline

A GitHub Actions workflow is located at `.github/workflows/ci.yml`. It runs automatically on **push** and **pull requests** to the `main` branch.

### What it does:

| Job | Action | Directory |
|-----|--------|-----------|
| `backend-test` | `npm ci` → `npm test` → `npm run lint` (Node 18 & 20) | `./backend` |
| `frontend-build` | `npm ci` → `npm run build` | `./frontend` |
| `docker-build` | Builds Docker images for backend and frontend | Root |

### Workflow overview (`.github/workflows/ci.yml`):

```yaml
name: CI/CD Pipeline
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }
jobs:
  backend-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
          cache-dependency-path: './backend/package-lock.json'
      - run: npm ci
      - run: npm test
      - run: npm run lint --if-present

  frontend-build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: './frontend/package-lock.json'
      - run: npm ci
      - run: npm run build

  docker-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t food-delivery-backend ./backend
        continue-on-error: true
      - run: docker build -t food-delivery-frontend ./frontend
        continue-on-error: true
```

To enable CI/CD, simply push to `main` or open a PR. The workflow will validate linting, tests, and build steps before any deployment can proceed.

---

## Section 6: Post-Deployment

### 6.1 — Verify Stripe Webhook Redirects

Stripe Checkout redirects are controlled by the backend's `FRONTEND_URL` env variable. Ensure it is set to your Vercel frontend URL:
```
https://<your-project-name>.vercel.app
```

If Stripe redirects return to `localhost` after payment, update the backend env variable and redeploy.

### 6.2 — Test the Full Flow

Walk through every major feature to confirm everything works end-to-end:

1. **Register** — Create a new account
2. **Browse restaurants** — View the restaurant list
3. **Browse menus/food items** — Click into a restaurant
4. **Add to cart** — Add items and verify the cart
5. **Checkout** — Proceed to shipping and payment
6. **Pay with Stripe** — Use test card `4242 4242 4242 4242`, any future date, any CVC
7. **View orders** — Confirm the order appears in "My Orders"
8. **AI Recipe Generator** — Test the Groq-powered recipe/review features

### 6.3 — Update CORS Origin in Backend

The backend's CORS origin is hardcoded in `backend/app.js:18`:

```js
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
```

**Update this to allow both localhost and the production frontend:**

```js
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://<your-project-name>.vercel.app"
  ],
  credentials: true,
};
app.use(cors(corsOptions));
```

After making this change, commit and push to `main` — Render will auto-deploy if you have **Auto-Deploy** enabled, or you can trigger a manual redeploy.

---

## Section 7: Troubleshooting

### CORS Errors (Browser console)

**Error:** `Access-Control-Allow-Origin` missing or mismatched.

**Fix:**
- Check that `FRONTEND_URL` in Render env matches your Vercel URL exactly (no trailing slash).
- Update the CORS origin array in `backend/app.js` to include your Vercel domain.
- Redeploy the backend after changes.

### Stripe Redirects to localhost

**Error:** After payment, Stripe redirects to `http://localhost:5173` instead of the live site.

**Fix:**
- Update `FRONTEND_URL` in Render environment to `https://<your-project-name>.vercel.app`.
- Save and redeploy the backend.

### MongoDB Connection Failure

**Error:** `MongooseServerSelectionError` or `Authentication failed`.

**Fix:**
- Log in to [MongoDB Atlas](https://cloud.mongodb.com).
- Go to **Network Access** → **IP Whitelist**.
- Add `0.0.0.0/0` (allow all) or add Render's outbound IP ranges.
- Verify the `DB_URI` env variable is pasted correctly with no extra spaces or quotes.

### Groq AI 403 or Authentication Errors

**Error:** `403 Forbidden` or `Invalid API key` when using recipe/review features.

**Fix:**
- Verify `GROQ_API_KEY` is set correctly in Render environment.
- If behind a restrictive network, set `HTTP_PROXY` and `HTTPS_PROXY` (values provided in Section 2).
- Check that the Groq API key has not expired or been revoked.

### Backend Crash on Startup

**Error:** Service fails to start or shows `ERR_MODULE_NOT_FOUND`.

**Fix:**
- Confirm **Root Directory** is set to `backend`.
- Confirm **Build Command** is `npm install` (not `npm ci`).
- Run `npm install` locally to verify no missing dependencies.
- Check logs in Render dashboard → your service → **Logs**.

### Vercel Build Fails

**Error:** Build exits with a non-zero code.

**Fix:**
- Ensure **Root Directory** is set to `frontend`.
- Ensure **Framework Preset** is `Vite`.
- Run `npm run build` locally from the `frontend` directory to catch errors early.
- Check if any `VITE_*` env variables are missing in Vercel's project settings.

### 404 on API Calls from Frontend

**Error:** All API requests return 404.

**Fix:**
- Verify `VITE_API_URL` in Vercel env points to `https://foodjenie-api.onrender.com` (no trailing slash, no `/api` suffix).
- The `api.js` utility automatically appends `/api` to the base URL, so the full URL becomes `https://foodjenie-api.onrender.com/api/v1/...`.
- Confirm the Render backend is running and reachable at the `/test` endpoint.
