import Restaurant from "../models/restaurant.js"
import dotenv from "dotenv"
import connectDatabase from "../config/database.js"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const restaurants = require("../data/restaurants.json")

dotenv.config({ path: "config/config.env" })

connectDatabase()

const seedRestaurants = async () => {
  try {
    await Restaurant.deleteMany()
    console.log("Restaurants are deleted")
    await Restaurant.insertMany(restaurants)
    console.log("All Restaurants are added.")
    process.exit()
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}

seedRestaurants()
