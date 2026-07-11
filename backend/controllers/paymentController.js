import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

const getConfig = () => ({
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || "usd",
  DEFAULT_DELIVERY_AMOUNT: parseInt(process.env.DELIVERY_AMOUNT || "500", 10),
  ALLOWED_COUNTRIES: (process.env.ALLOWED_COUNTRIES || "").split(",").filter(Boolean),
});

const STRIPE_SUPPORTED_COUNTRIES = [
  "US", "CA", "GB", "IE", "AU", "NZ", "AT", "BE", "BG", "HR", "CY", "CZ", "DK",
  "EE", "FI", "FR", "DE", "GR", "HU", "IT", "LV", "LT", "LU", "MT", "NL", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE", "CH", "NO", "BR", "MX", "SG", "HK", "JP",
  "IN", "AE", "MY", "TH", "PH", "ID", "VN", "KR", "TW"
];

//process payment api
export const processPayment = catchAsyncErrors(async (req, res, next) => {
  const { items, currency, shippingCountry } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Items array is required",
    });
  }

  const stripe = getStripe();
  const config = getConfig();
  const selectedCurrency = (currency || config.DEFAULT_CURRENCY).toLowerCase();
  const countries = config.ALLOWED_COUNTRIES.length > 0 ? config.ALLOWED_COUNTRIES : STRIPE_SUPPORTED_COUNTRIES;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: selectedCurrency,
      product_data: {
        name: item.foodItem.name,
        images: item.foodItem.images?.[0]?.url ? [item.foodItem.images[0].url] : [],
      },
      unit_amount: Math.round(item.foodItem.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    phone_number_collection: { enabled: true },
    line_items: lineItems,
    mode: "payment",
    shipping_address_collection: { allowed_countries: countries },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery Charges",
          type: "fixed_amount",
          fixed_amount: { amount: config.DEFAULT_DELIVERY_AMOUNT, currency: selectedCurrency },
          delivery_estimate: {
            minimum: { unit: "hour", value: 1 },
            maximum: { unit: "hour", value: 3 },
          },
        },
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });

  res.status(200).json({ url: session.url });
});

//send stripe publishable key
export const sendStripeApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});