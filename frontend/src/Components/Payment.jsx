import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import Loader from "./layout/Loader";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const { cartItem, resturant, deliveryInfo } = useSelector((state) => state.cart);

  useEffect(() => {
    const processPayment = async () => {
      setLoading(true);
      try {
        const items = cartItem.map((item) => ({
          foodItem: {
            name: item.foodItem.name,
            price: item.foodItem.price,
            images: item.foodItem.images,
          },
          quantity: item.quantity,
        }));

        sessionStorage.setItem("orderCartItems", JSON.stringify(cartItem));
        sessionStorage.setItem("orderRestaurant", JSON.stringify(resturant));
        sessionStorage.setItem("orderDeliveryInfo", JSON.stringify(deliveryInfo));

        const { data } = await api.post("/v1/payment/process", {
          items,
          currency: "usd",
        });

        window.location.href = data.url;
      } catch (error) {
        console.error("Payment error:", error);
        setLoading(false);
      }
    };

    processPayment();
  }, [cartItem, resturant, deliveryInfo]);

  return <div>{loading && <Loader />}</div>;
};

export default Payment;
