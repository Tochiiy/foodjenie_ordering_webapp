import Restaurant from "../models/restaurant.js"
import FoodItem from "../models/foodItem.js"
import Menu from "../models/menu.js"
import dotenv from "dotenv"
import connectDatabase from "../config/database.js"

dotenv.config({ path: "config/config.env" })

connectDatabase()

const seedMenus = async () => {
  try {
    await Menu.deleteMany()

    const restaurants = await Restaurant.find()
    const foodItems = await FoodItem.find()

    if (restaurants.length === 0 || foodItems.length === 0) {
      console.log("No restaurants or food items found. Run seeders first.")
      process.exit()
    }

    const categories = ["Main Course", "Beverages", "Desserts", "Starters"]
    const itemsPerRestaurant = Math.floor(foodItems.length / restaurants.length)
    const remainder = foodItems.length % restaurants.length

    let startIdx = 0

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i]
      const count = itemsPerRestaurant + (i < remainder ? 1 : 0)
      const restaurantItems = foodItems.slice(startIdx, startIdx + count)
      startIdx += count

      const menuData = categories.map((category, catIdx) => ({
        category,
        items: restaurantItems
          .filter((_, itemIdx) => itemIdx % categories.length === catIdx)
          .map((item) => item._id),
      })).filter((c) => c.items.length > 0)

      const menu = await Menu.create({
        menu: menuData,
        restaurant: restaurant._id,
      })

      await FoodItem.updateMany(
        { _id: { $in: restaurantItems.map((item) => item._id) } },
        { $set: { restaurant: restaurant._id, menu: menu._id } }
      )

      console.log(`Menu created for ${restaurant.name} with ${restaurantItems.length} items in ${menuData.length} categories`)
    }

    console.log("All menus seeded successfully!")
    process.exit()
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}

seedMenus()
