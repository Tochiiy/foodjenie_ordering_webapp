import Fooditem from "../models/foodItem.js"
import dotenv from "dotenv"
import connectDatabase from "../config/database.js"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const fooditems = require("../data/foodItem.json")

dotenv.config({ path: "config/config.env" })

connectDatabase()

const seedFooditems = async () => {
  try {
    await Fooditem.deleteMany()
    console.log("FoodItems are deleted")
    await Fooditem.insertMany(fooditems)
    console.log("All FoodItems are added.")
    process.exit()
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}

seedFooditems()