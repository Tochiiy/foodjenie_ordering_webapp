import express from "express"
const router = express.Router()
import {
  generateFoodAI,
  generateAndSaveFoodAI,
  analyzeRestaurantReviews,
  addReview,
  generateRecipeAI,
} from "../controllers/aiController.js"

router.get("/test", (req, res) => {
  res.send("AI route working")
})

router.post("/generate-food-ai", generateFoodAI)

router.post("/generate-food-ai/:foodId", generateAndSaveFoodAI)

router.put("/admin/restaurants/:id/analyze", analyzeRestaurantReviews)

router.put("/stores/:id/review", addReview)

router.post("/recipe/generate", generateRecipeAI)

export default router
