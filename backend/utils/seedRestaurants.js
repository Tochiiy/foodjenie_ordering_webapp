import dotenv from "dotenv";
import mongoose from "mongoose";
import Restaurant from "../models/restaurant.js";
import FoodItem from "../models/foodItem.js";
import Menu from "../models/menu.js";
import connectDatabase from "../config/database.js";

dotenv.config({ path: "../config/config.env" });

const cuisines = {
  Japanese: {
    restaurantNames: [
      "Sakura Sushi", "Tokyo Bites", "Zen Garden Sushi", "Umi Ramen House",
      "Kyoto Kitchen", "Sushi Bay", "Bamboo Sushi Bar", "Nori & Rice",
      "Osaka Grill", "Fuji Sushi Co", "Ichiban Sushi", "Sakana House",
      "Moon Ramen",
    ],
    streets: ["Oak Avenue", "Maple Street", "Cedar Lane"],
    menu: [
      ["Salmon Nigiri (6pc)", 12.99, "Sushi"],
      ["Spicy Tuna Roll", 9.99, "Sushi"],
      ["Dragon Roll", 15.99, "Sushi"],
      ["California Roll", 8.99, "Sushi"],
      ["Miso Soup", 3.49, "Starters"],
      ["Edamame", 4.99, "Starters"],
      ["Chicken Katsu", 13.49, "Mains"],
      ["Tonkotsu Ramen", 12.49, "Ramen"],
      ["Gyoza (6pc)", 6.99, "Starters"],
      ["Mochi Ice Cream", 5.49, "Dessert"],
    ],
  },
  Indian: {
    restaurantNames: [
      "Bombay Spice House", "Curry Leaf", "Taj Kitchen", "Saffron Palace",
      "Spice Route", "Delhi Darbar", "Masala Junction", "Ganges Grill",
      "Punjabi Tadka", "Royal Spice", "Tandoor Nights", "Namaste Kitchen",
      "Mumbai Masala",
    ],
    streets: ["Curry Lane", "Spice Boulevard", "Ganges Road"],
    menu: [
      ["Chicken Biryani", 12.99, "Rice"],
      ["Butter Chicken", 13.49, "Curry"],
      ["Paneer Tikka Masala", 11.99, "Curry"],
      ["Garlic Naan", 2.99, "Bread"],
      ["Samosas (4pc)", 5.99, "Starters"],
      ["Chana Masala", 10.49, "Curry"],
      ["Lamb Rogan Josh", 14.99, "Curry"],
      ["Mango Lassi", 3.99, "Drinks"],
      ["Tandoori Chicken", 13.99, "Mains"],
      ["Gulab Jamun", 4.49, "Dessert"],
    ],
  },
  Italian: {
    restaurantNames: [
      "Napoli Pizzeria", "La Piazza", "Trattoria Bella", "Roma Kitchen",
      "Vino & Pasta", "Little Italy Cafe", "Bella Notte", "Pasta Fresca",
      "Ristorante Milano", "Tuscan Table", "Da Vinci Kitchen", "Venezia Cafe",
      "Sorrento Pizzeria",
    ],
    streets: ["Vine Street", "Little Italy Ave", "Milano Road"],
    menu: [
      ["Margherita Pizza", 14.99, "Pizza"],
      ["Pepperoni Pizza", 16.99, "Pizza"],
      ["Spaghetti Carbonara", 13.99, "Pasta"],
      ["Fettuccine Alfredo", 13.49, "Pasta"],
      ["Lasagna", 14.49, "Pasta"],
      ["Tiramisu", 6.99, "Dessert"],
      ["Garlic Bread", 4.49, "Starters"],
      ["Caprese Salad", 8.99, "Starters"],
      ["Chicken Parmesan", 15.99, "Mains"],
      ["Panna Cotta", 5.99, "Dessert"],
    ],
  },
  Mexican: {
    restaurantNames: [
      "El Sabor Mexicano", "Taco Fiesta", "La Casa Verde", "Burrito Bros",
      "Cantina Sol", "Aztec Kitchen", "El Charro", "Salsa Street",
      "Casa Del Taco", "Mariachi Grill", "El Jalapeno", "La Frontera",
      "Taqueria Luna",
    ],
    streets: ["Fiesta Boulevard", "Aztec Avenue", "Sol Street"],
    menu: [
      ["Chicken Burrito", 9.99, "Burritos"],
      ["Carne Asada Tacos (3pc)", 11.49, "Tacos"],
      ["Guacamole & Chips", 6.99, "Starters"],
      ["Churros", 4.99, "Dessert"],
      ["Quesadilla", 8.49, "Mains"],
      ["Nachos Supreme", 9.49, "Starters"],
      ["Enchiladas Verdes", 11.99, "Mains"],
      ["Horchata", 3.49, "Drinks"],
      ["Fish Tacos (3pc)", 12.49, "Tacos"],
      ["Elote (Mexican Street Corn)", 4.99, "Starters"],
    ],
  },
  Chinese: {
    restaurantNames: [
      "Dragon Wok", "Golden Panda", "Great Wall Kitchen", "Canton House",
      "Jade Garden", "Lucky Dragon", "Szechuan Palace", "Wok This Way",
      "Red Lantern", "Peking Kitchen", "Bamboo Grove", "Golden Dragon Cafe",
      "Ming Dynasty",
    ],
    streets: ["Canton Road", "Jade Street", "Dragon Lane"],
    menu: [
      ["Kung Pao Chicken", 11.99, "Mains"],
      ["Vegetable Fried Rice", 8.99, "Rice"],
      ["Spring Rolls (4pc)", 5.49, "Starters"],
      ["Sweet & Sour Pork", 12.49, "Mains"],
      ["Mapo Tofu", 10.99, "Mains"],
      ["Beef Chow Mein", 11.49, "Noodles"],
      ["Dumplings (6pc)", 7.99, "Starters"],
      ["Hot & Sour Soup", 4.99, "Starters"],
      ["General Tso's Chicken", 12.99, "Mains"],
      ["Egg Fried Rice", 7.49, "Rice"],
    ],
  },
  American: {
    restaurantNames: [
      "Downtown Diner", "The Burger Joint", "Route 66 Grill", "Liberty Kitchen",
      "Smokehouse BBQ", "Main Street Eats", "The Corner Diner", "Uptown Grill",
      "Patriot Grill", "Classic Cafe", "The Griddle House", "Highway Diner",
      "Union Square Eats",
    ],
    streets: ["Main Street", "Liberty Avenue", "Route 66"],
    menu: [
      ["Classic Cheeseburger", 10.99, "Burgers"],
      ["BBQ Bacon Burger", 12.99, "Burgers"],
      ["Buffalo Wings (8pc)", 9.99, "Starters"],
      ["Loaded Fries", 6.99, "Starters"],
      ["Grilled Chicken Sandwich", 10.49, "Sandwiches"],
      ["Mac & Cheese", 8.99, "Sides"],
      ["Caesar Salad", 8.49, "Salads"],
      ["Milkshake", 5.49, "Drinks"],
      ["BBQ Ribs", 16.99, "Mains"],
      ["Apple Pie", 5.99, "Dessert"],
    ],
  },
  Thai: {
    restaurantNames: [
      "Bangkok Garden", "Thai Orchid", "Siam Kitchen", "Lemongrass Cafe",
      "Basil & Lime", "Golden Elephant", "Thai Spice", "Krung Thep Kitchen",
      "Chiang Mai Table", "Thai Basil House", "Emerald Thai", "Lotus Thai Kitchen",
      "Phuket Cafe",
    ],
    streets: ["Orchid Street", "Siam Avenue", "Lemongrass Lane"],
    menu: [
      ["Pad Thai", 11.99, "Noodles"],
      ["Green Curry", 12.49, "Curry"],
      ["Tom Yum Soup", 7.99, "Starters"],
      ["Spring Rolls (4pc)", 5.99, "Starters"],
      ["Mango Sticky Rice", 6.49, "Dessert"],
      ["Massaman Curry", 12.99, "Curry"],
      ["Basil Fried Rice", 10.49, "Rice"],
      ["Satay Skewers (4pc)", 8.49, "Starters"],
      ["Panang Curry", 12.49, "Curry"],
      ["Thai Iced Tea", 3.99, "Drinks"],
    ],
  },
  Mediterranean: {
    restaurantNames: [
      "Olive Grove", "Mediterraneo", "Cedar Kitchen", "Aegean Table",
      "Sunset Grill", "The Olive Branch", "Levant Kitchen", "Blue Coast Cafe",
      "Santorini Table", "Cypress Grill", "Marina Mediterranean", "Golden Olive",
      "Coastal Kebab House",
    ],
    streets: ["Olive Street", "Aegean Avenue", "Cedar Boulevard"],
    menu: [
      ["Chicken Shawarma", 10.99, "Mains"],
      ["Falafel Wrap", 8.99, "Wraps"],
      ["Hummus & Pita", 6.49, "Starters"],
      ["Greek Salad", 8.99, "Salads"],
      ["Lamb Kebab", 13.99, "Mains"],
      ["Baklava", 4.99, "Dessert"],
      ["Tabbouleh", 6.99, "Starters"],
      ["Stuffed Grape Leaves (6pc)", 6.99, "Starters"],
      ["Chicken Souvlaki", 12.49, "Mains"],
      ["Tzatziki & Pita", 5.49, "Starters"],
    ],
  },
  Korean: {
    restaurantNames: [
      "Seoul Kitchen", "Kimchi House", "Gangnam Grill", "Han River Table",
      "Bibimbap Bowl", "Busan BBQ", "K-Town Eats", "Golden Kimchi",
      "Namsan Kitchen", "Seoul Street Grill", "Han's Table", "Mugunghwa Cafe",
      "Korean Garden",
    ],
    streets: ["Seoul Street", "Han Avenue", "K-Town Boulevard"],
    menu: [
      ["Bibimbap", 12.49, "Rice"],
      ["Korean Fried Chicken", 13.99, "Mains"],
      ["Bulgogi", 14.49, "Mains"],
      ["Kimchi Fried Rice", 10.99, "Rice"],
      ["Japchae", 11.49, "Noodles"],
      ["Kimchi Pancake", 8.49, "Starters"],
      ["Tteokbokki", 9.99, "Starters"],
      ["Korean Corn Dog", 6.99, "Starters"],
      ["Bulgogi Beef Bowl", 13.49, "Mains"],
      ["Sweet Rice Cake Dessert", 5.49, "Dessert"],
    ],
  },
  Vietnamese: {
    restaurantNames: [
      "Pho Saigon", "Hanoi Kitchen", "Little Vietnam", "Pho 68",
      "Golden Lotus Vietnamese", "Vietnam Street Kitchen", "Saigon Grill", "Pho House",
      "Bamboo Vietnamese Bistro", "Mekong Table", "Pho Delight", "Rice Paper Kitchen",
      "Nha Trang Cafe",
    ],
    streets: ["Saigon Street", "Mekong Avenue", "Hanoi Lane"],
    menu: [
      ["Beef Pho", 11.99, "Noodles"],
      ["Chicken Pho", 10.99, "Noodles"],
      ["Spring Rolls (Fresh, 4pc)", 6.49, "Starters"],
      ["Banh Mi Sandwich", 8.99, "Sandwiches"],
      ["Vermicelli Bowl", 11.49, "Noodles"],
      ["Vietnamese Iced Coffee", 3.99, "Drinks"],
      ["Fried Spring Rolls (4pc)", 6.99, "Starters"],
      ["Lemongrass Chicken", 12.49, "Mains"],
      ["Papaya Salad", 8.49, "Salads"],
      ["Coconut Sticky Rice", 5.49, "Dessert"],
    ],
  },
  French: {
    restaurantNames: [
      "Cafe Paris", "Le Bistro", "Bonjour Kitchen", "La Boulangerie",
      "Chez Amelie", "Le Petit Cafe", "Rue de Table", "La Belle Cuisine",
      "Cafe Provence", "Le Rendezvous", "Maison Bistro", "La Lumiere",
      "Champs Cafe",
    ],
    streets: ["Rue Boulevard", "Provence Avenue", "Bistro Lane"],
    menu: [
      ["Croque Monsieur", 10.49, "Sandwiches"],
      ["French Onion Soup", 7.99, "Starters"],
      ["Coq au Vin", 16.99, "Mains"],
      ["Beef Bourguignon", 17.99, "Mains"],
      ["Quiche Lorraine", 9.99, "Mains"],
      ["Croissant", 3.49, "Bakery"],
      ["Ratatouille", 11.49, "Mains"],
      ["Creme Brulee", 6.99, "Dessert"],
      ["Escargot (6pc)", 9.49, "Starters"],
      ["Macarons (4pc)", 6.49, "Dessert"],
    ],
  },
  Caribbean: {
    restaurantNames: [
      "Island Spice", "Jerk Hut", "Caribbean Breeze", "Reggae Kitchen",
      "Coconut Grove Caribbean", "Tropical Table", "Jamaica Jerk House", "Sunset Island Kitchen",
      "Calypso Kitchen", "Palm Tree Grill", "Blue Lagoon Cafe", "Island Vybz Kitchen",
      "Spice Island Grill",
    ],
    streets: ["Island Avenue", "Palm Street", "Reggae Road"],
    menu: [
      ["Jerk Chicken", 13.49, "Mains"],
      ["Curry Goat", 15.49, "Mains"],
      ["Oxtail Stew", 16.49, "Mains"],
      ["Rice and Peas", 5.99, "Sides"],
      ["Plantains", 4.99, "Sides"],
      ["Beef Patty", 4.49, "Starters"],
      ["Jerk Pork", 14.49, "Mains"],
      ["Callaloo", 6.99, "Starters"],
      ["Rum Cake", 5.99, "Dessert"],
      ["Sorrel Drink", 3.99, "Drinks"],
    ],
  },
  Spanish: {
    restaurantNames: [
      "Tapas Barcelona", "Casa Espana", "El Flamenco", "Madrid Table",
      "Sevilla Kitchen", "Tapas & Vino", "La Paella House", "Costa Brava Cafe",
      "El Toro Kitchen", "Iberia Bistro", "Sol Y Sombra", "Valencia Table",
      "Rioja Kitchen",
    ],
    streets: ["Barcelona Boulevard", "Madrid Avenue", "Sevilla Street"],
    menu: [
      ["Paella Valenciana", 16.99, "Mains"],
      ["Patatas Bravas", 6.99, "Starters"],
      ["Jamon Croquetas (6pc)", 8.49, "Starters"],
      ["Gambas al Ajillo", 12.49, "Starters"],
      ["Tortilla Espanola", 8.99, "Starters"],
      ["Grilled Chorizo", 9.49, "Starters"],
      ["Gazpacho", 6.49, "Starters"],
      ["Churros con Chocolate", 6.99, "Dessert"],
      ["Beef Empanadas (4pc)", 7.99, "Starters"],
      ["Sangria (Pitcher)", 14.99, "Drinks"],
    ],
  },
};

const cuisineCities = {
  Japanese: { city: "New York", state: "NY", latBase: 40.75, lngBase: -73.98 },
  Indian: { city: "Jersey City", state: "NJ", latBase: 40.72, lngBase: -74.04 },
  Italian: { city: "New York", state: "NY", latBase: 40.78, lngBase: -73.97 },
  Mexican: { city: "Brooklyn", state: "NY", latBase: 40.68, lngBase: -73.95 },
  Chinese: { city: "Queens", state: "NY", latBase: 40.73, lngBase: -73.88 },
  American: { city: "Manhattan", state: "NY", latBase: 40.76, lngBase: -73.99 },
  Thai: { city: "Brooklyn", state: "NY", latBase: 40.70, lngBase: -73.92 },
  Mediterranean: { city: "New York", state: "NY", latBase: 40.74, lngBase: -73.94 },
  Korean: { city: "Flushing", state: "NY", latBase: 40.76, lngBase: -73.83 },
  Vietnamese: { city: "Brooklyn", state: "NY", latBase: 40.64, lngBase: -74.01 },
  French: { city: "New York", state: "NY", latBase: 40.76, lngBase: -73.97 },
  Caribbean: { city: "Brooklyn", state: "NY", latBase: 40.66, lngBase: -73.92 },
  Spanish: { city: "New York", state: "NY", latBase: 40.75, lngBase: -73.99 },
};

const reviewComments = [
  "Amazing food, will definitely order again!",
  "Great service and friendly staff.",
  "The flavours were incredibly authentic.",
  "Decent food but a bit pricey for the portion size.",
  "One of the best meals I've had in a while.",
  "Fast delivery and the food was still hot!",
  "The packaging was great and the food delicious.",
  "Average experience, nothing special.",
  "Highly recommend the starters here.",
  "Good value for money, generous portions.",
  "The dessert was the highlight of the meal.",
  "Will be ordering from here every week!",
  "A bit disappointed with the portion size.",
  "Fresh ingredients and great taste.",
  "Perfect for a quick and tasty meal.",
];

const reviewerNames = [
  "John D.", "Sarah M.", "Mike T.", "Emily R.", "David K.",
  "Jessica L.", "Chris P.", "Amanda N.", "James W.", "Rachel G.",
  "Daniel S.", "Lisa H.", "Robert B.", "Michelle Y.", "Kevin O.",
];

const defaultImages = [
  { public_id: "seeds/restaurant_1", url: "https://res.cloudinary.com/demo/image/upload/v1/seeds/restaurant_1" },
  { public_id: "seeds/restaurant_2", url: "https://res.cloudinary.com/demo/image/upload/v1/seeds/restaurant_2" },
];

const foodItemImages = [
  { public_id: "seeds/food_1", url: "https://res.cloudinary.com/demo/image/upload/v1/seeds/food_1" },
  { public_id: "seeds/food_2", url: "https://res.cloudinary.com/demo/image/upload/v1/seeds/food_2" },
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 4) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRating() {
  return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
}

function randomReviewCount() {
  return Math.floor(Math.random() * 300) + 5;
}

async function seedRestaurants(targetCount = 100) {
  try {
    connectDatabase();

    await mongoose.connection.dropCollection("menus").catch(() => {});
    await mongoose.connection.dropCollection("fooditems").catch(() => {});
    await mongoose.connection.dropCollection("restaurants").catch(() => {});

    console.log("Cleared existing restaurants, food items, and menus.");

    const cuisineNames = Object.keys(cuisines);
    const nameQueues = {};
    cuisineNames.forEach((c) => {
      nameQueues[c] = [...cuisines[c].restaurantNames].sort(() => Math.random() - 0.5);
    });

    let cuisineIndex = 0;
    const usedNames = new Set();

    while (cuisineIndex < targetCount) {
      const cuisineKey = cuisineNames[cuisineIndex % cuisineNames.length];
      const cuisineData = cuisines[cuisineKey];
      const queue = nameQueues[cuisineKey];
      const cityInfo = cuisineCities[cuisineKey];

      let name = queue.length > 0 ? queue.pop() : cuisineData.restaurantNames[0];
      let suffix = 2;
      let finalName = name;
      while (usedNames.has(finalName)) {
        finalName = `${name} ${suffix}`;
        suffix++;
      }
      usedNames.add(finalName);

      const street = pickRandom(cuisineData.streets);
      const address = `${randomBetween(100, 9999)} ${street}, ${cityInfo.city}, ${cityInfo.state}`;
      const lat = randomFloat(cityInfo.latBase - 0.03, cityInfo.latBase + 0.03);
      const lng = randomFloat(cityInfo.lngBase - 0.03, cityInfo.lngBase + 0.03);

      const restaurant = await Restaurant.create({
        name: finalName,
        address,
        cuisine: cuisineKey,
        isVeg: cuisineKey === "Indian",
        ratings: randomRating(),
        numOfReviews: randomReviewCount(),
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
        images: defaultImages,
      });

      const categories = {};
      for (const [itemName, price, category] of cuisineData.menu) {
        if (!categories[category]) {
          categories[category] = [];
        }
        const stock = randomBetween(10, 100);
        const foodItem = await FoodItem.create({
          name: itemName,
          price,
          description: `Delicious ${itemName.toLowerCase()} prepared fresh daily at ${finalName}.`,
          stock,
          images: foodItemImages,
          restaurant: restaurant._id,
        });
        categories[category].push(foodItem._id);
      }

      const menuStructure = Object.entries(categories).map(([category, items]) => ({
        category,
        items,
      }));

      const menuDoc = await Menu.create({
        menu: menuStructure,
        restaurant: restaurant._id,
      });

      await FoodItem.updateMany(
        { restaurant: restaurant._id },
        { $set: { menu: menuDoc._id } }
      );

      const reviewCount = randomBetween(2, 5);
      const reviews = [];
      for (let r = 0; r < reviewCount; r++) {
        reviews.push({
          name: pickRandom(reviewerNames),
          rating: randomBetween(1, 5),
          Comment: pickRandom(reviewComments),
        });
      }

      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      restaurant.reviews = reviews;
      restaurant.ratings = parseFloat(avgRating.toFixed(1));
      restaurant.numOfReviews = reviews.length;
      await restaurant.save();

      console.log(`[${cuisineIndex + 1}/${targetCount}] Created: ${finalName} (${cuisineKey})`);
      cuisineIndex++;
    }

    console.log(`\nSeeding complete! Created ${cuisineIndex} restaurants.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedRestaurants(100);
