import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../redux/actions/orderActions";
import { clearCart } from "../redux/actions/cartActions";
import { getMyOrders } from "../redux/actions/orderActions";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const createdRef = useRef(false);
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");

  let { cartItem, resturant, deliveryInfo } = useSelector((state) => state.cart);
  const { order, creating } = useSelector((state) => state.orders);

  if ((!cartItem || cartItem.length === 0) && sessionStorage.getItem("orderCartItems")) {
    cartItem = JSON.parse(sessionStorage.getItem("orderCartItems"));
    resturant = JSON.parse(sessionStorage.getItem("orderRestaurant"));
    deliveryInfo = JSON.parse(sessionStorage.getItem("orderDeliveryInfo"));
  }

  const getRestaurantId = () => resturant?._id || resturant;

  useEffect(() => {
    if (createdRef.current) return;
    if (!cartItem || cartItem.length === 0) return;

    const subtotal = cartItem.reduce((acc, item) => acc + item.foodItem.price * item.quantity, 0);
    const deliveryCharges = subtotal > 500 ? 0 : 40;

    const orderData = {
      shippingInfo: deliveryInfo,
      orderItems: cartItem.map((item) => ({
        name: item.foodItem.name,
        foodItem: item.foodItem._id,
        quantity: item.quantity,
        price: item.foodItem.price,
      })),
      restaurant: getRestaurantId(),
      paymentInfo: { sessionId, status: "paid" },
      itemsPrice: subtotal,
      deliveryPrice: deliveryCharges,
      totalPrice: subtotal + deliveryCharges,
    };

    dispatch(createOrder(orderData));
    if (getRestaurantId()) {
      dispatch(clearCart(getRestaurantId()));
    }
    sessionStorage.removeItem("orderCartItems");
    sessionStorage.removeItem("orderRestaurant");
    sessionStorage.removeItem("orderDeliveryInfo");
    createdRef.current = true;
  }, [dispatch, cartItem, resturant, deliveryInfo, sessionId]);

  return (
    <div className="container text-center my-5">
      {creating ? (
        <div className="py-5">
          <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5">Processing your order...</p>
        </div>
      ) : order ? (
        <>
          <div style={{ fontSize: "80px", color: "green" }}>&#10003;</div>
          <h2 className="mt-3">Thank You for Your Order!</h2>
          <p>Your payment was successful. Order <strong>#{order._id}</strong> has been placed.</p>
          {sessionId && (
            <p><strong>Session ID:</strong> {sessionId}</p>
          )}
          <div className="mt-4">
            <Link to="/orders" className="btn btn-primary me-3">
              View Orders
            </Link>
            <Link to="/" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="alert alert-warning" role="alert">
            Order could not be created. Please contact support.
          </div>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </>
      )}
    </div>
  );
};

export default OrderSuccess;
