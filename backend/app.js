import express from "express"
import cookieParser from "cookie-parser"
const app = express()

console.log('App.js loaded')

import auth from "./routes/auth.js"
import restaurant from "./routes/restaurant.js"
import cart from "./routes/cart.js"
import order from "./routes/order.js"
import payment from "./routes/payment.js"

import cors from "cors"

app.use(cors())
app.use(express.json())
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
app.use("/api/v1/eats/stores", restaurant)
app.use("/api/v1/cart", cart)
app.use("/api/v1/orders", order)
app.use("/api/v1/payment", payment)

import errorMiddleware from "./middlewares/errors.js"
app.use(errorMiddleware)

export default app