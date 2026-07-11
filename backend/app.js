import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()

console.log('App.js loaded')

import auth from "./routes/auth.js"
import restaurant from "./routes/restaurant.js"
import cart from "./routes/cart.js"
import order from "./routes/order.js"
import payment from "./routes/payment.js"
import foodRouter from "./routes/foodItem.js"
import menuRouter from "./routes/menu.js"
import coupon from "./routes/couponRoutes.js"
import aiRoutes from "./routes/ai.routes.js"

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }))
app.use(express.json({ limit: "30kb" }))
app.use(express.urlencoded({ extended: true, limit: "30kb" }))
app.use(cookieParser())

app.get("/test", (req, res) => {
  console.log('Test route hit')
  res.json({ message: "Server is working" })
})

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.path)
  next()
})

app.use("/api/v1/users", auth)
app.use("/api/v1/eats", foodRouter)
app.use("/api/v1/eats/menus", menuRouter)
app.use("/api/v1/eats/stores", restaurant)
app.use("/api/v1/eats/orders", order)
app.use("/api/v1/orders", order)
app.use("/api/v1/eats/cart", cart)
app.use("/api/v1/cart", cart)
app.use("/api/v1/payment", payment)
app.use("/api/v1/coupon", coupon)
app.use("/api/v1/ai", aiRoutes)

import errorMiddleware from "./middlewares/errors.js"
app.use(errorMiddleware)

export default app