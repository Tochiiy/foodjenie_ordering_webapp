import app from "./app.js"
import connectDatabase from "./config/database.js"

import dotenv from "dotenv"

dotenv.config({ path: "./config/config.env" })

connectDatabase()

const PORT = process.env.PORT

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on PORT: ${PORT}`)
})