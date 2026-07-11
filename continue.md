# Continue From Here

## Project Status
Food Delivery Website - Backend API tested and working

## Server Configuration
- **Port**: 8080
- **Database**: MongoDB Atlas (connected)
- **JWT Secret**: Configured in config.env
- **Cloudinary**: Configured for image uploads

## Tested Routes (All Working)

### Auth Routes (`/api/v1/users`)
| Method | Endpoint | Body | Status |
|--------|----------|------|--------|
| POST | `/signup` | `{name, email, phoneNumber, password, passwordConfirm}` | ✅ Returns token + user |
| POST | `/login` | `{email, password}` | ✅ Returns token + user |

### Restaurant Routes (`/api/v1/eats/stores`)
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/` | ✅ Returns restaurants array |
| POST | `/` | ✅ Creates restaurant, returns created restaurant |
| GET | `/:storeId` | ✅ Returns restaurant by ID |

### Cart Routes (`/api/v1/cart`) - Requires Auth
| Method | Endpoint | Body/Params | Status |
|--------|----------|-------------|--------|
| POST | `/` | `{foodItemId, quantity, restaurantId}` | ✅ Add to cart / create cart |
| GET | `/` | `?restaurantId=` (optional) | ✅ Get user's cart |
| PUT | `/item/:foodItemId` | `{foodItemId, quantity}` | ✅ Update item quantity |
| DELETE | `/item/:foodItemId` | - | ✅ Remove item from cart |
| DELETE | `/clear/:restaurantId` | - | ✅ Clear cart for restaurant |

### Payment Routes (`/api/v1`) - Requires Auth
| Method | Endpoint | Body/Params | Status |
|--------|----------|-------------|--------|
| GET | `/stripeapikey` | - | ✅ Returns Stripe publishable key |
| POST | `/payment/process` | `{items[], currency?}` | ✅ Returns Stripe checkout URL |

## Key Files Modified
1. **`backend/middlewares/errors.js`** - Fixed error handling for undefined NODE_ENV
2. **`backend/server.js`** - Changed `app.listen(PORT)` to `app.listen(PORT, '0.0.0.0')`
3. **`backend/app.js`** - Added test route, request logging, cookie-parser, cart & payment routes
4. **`backend/controllers/restaurantController.js`** - Added createRestaurant function
5. **`backend/routes/restaurant.js`** - Added POST route for creating restaurants
6. **`backend/controllers/cartController.js`** - New: Cart CRUD operations (add, get, update, remove, clear)
7. **`backend/routes/cart.js`** - New: Cart routes with auth middleware
8. **`backend/middlewares/auth.js`** - New: JWT authentication middleware
9. **`backend/models/cartModel.js`** - Existing: Cart schema (per-restaurant carts)
10. **`backend/models/foodItem.js`** - Existing: FoodItem schema
11. **`backend/controllers/paymentController.js`** - New: Stripe checkout session creation
12. **`backend/routes/payment.js`** - New: Payment routes with auth middleware

## To Start Server
```bash
cd backend
npm start
```

## To Test Routes
```bash
# Signup
curl -X POST http://localhost:8080/api/v1/users/signup -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","phoneNumber":"1234567890","password":"password123","passwordConfirm":"password123"}'

# Login (saves cookie)
curl -X POST http://localhost:8080/api/v1/users/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}' -c cookies.txt

# Get restaurants
curl http://localhost:8080/api/v1/eats/stores

# Create restaurant
curl -X POST http://localhost:8080/api/v1/eats/stores -H "Content-Type: application/json" -d '{"name":"Test Restaurant","address":"123 Main St","isVeg":false,"location":{"type":"Point","coordinates":[-73.935242,40.730610]},"images":[],"ratings":4.5}'

# Add to cart (requires login cookie)
curl -X POST http://localhost:8080/api/v1/cart -H "Content-Type: application/json" -d '{"foodItemId":"FOOD_ITEM_ID","quantity":2,"restaurantId":"RESTAURANT_ID"}' -b cookies.txt

# Get cart
curl http://localhost:8080/api/v1/cart -b cookies.txt

# Update cart item quantity
curl -X PUT http://localhost:8080/api/v1/cart/item/FOOD_ITEM_ID -H "Content-Type: application/json" -d '{"foodItemId":"FOOD_ITEM_ID","quantity":3}' -b cookies.txt

# Remove item from cart
curl -X DELETE http://localhost:8080/api/v1/cart/item/FOOD_ITEM_ID -b cookies.txt

# Clear cart for restaurant
curl -X DELETE http://localhost:8080/api/v1/cart/clear/RESTAURANT_ID -b cookies.txt

# Get Stripe publishable key
curl http://localhost:8080/api/v1/stripeapikey -b cookies.txt

# Process payment (create checkout session)
curl -X POST http://localhost:8080/api/v1/payment/process -H "Content-Type: application/json" -d '{"items":[{"foodItem":{"name":"Pizza","price":12.99,"images":[{"url":"https://example.com/pizza.jpg"}]},"quantity":2}],"currency":"usd"}' -b cookies.txt
```

## Next Steps (Suggested)
1. Add menu/food item routes (CRUD for food items)
2. Add order/checkout functionality (order model, order creation after payment)
3. Add review/rating system
4. Set up frontend integration
5. Add input validation middleware

## Known Issues
- NODE_ENV not set in config.env (defaults to production-like behavior)
- No input validation middleware beyond Mongoose schema
- Order creation not implemented (payment success doesn't create order)