import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../redux/actions/orderActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import Loader from "./layout/Loader";
import Message from "./Message";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch, id]);

  return (
    <div className="order-details container mt-4">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : order ? (
        <div className="orderdetai">
          <h2>Order #{order._id}</h2>
          <hr />

          <h4>Shipping Info</h4>
          <div className="card p-3 mb-4">
            <p><strong>Address:</strong> {order.shippingInfo?.address}</p>
            <p><strong>City:</strong> {order.shippingInfo?.city}</p>
            <p><strong>Postal Code:</strong> {order.shippingInfo?.postalCode}</p>
            <p><strong>Phone:</strong> {order.shippingInfo?.phone}</p>
          </div>

          <h4>Payment Info</h4>
          <div className="card p-3 mb-4">
            <p>
              <strong>Status:</strong>{" "}
              <span className={order.paymentInfo?.status === "paid" ? "greenColor" : "redColor"}>
                {order.paymentInfo?.status}
              </span>
            </p>
            {order.paidAt && (
              <p><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}</p>
            )}
          </div>

          <h4>Order Items</h4>
          {order.orderItems?.map((item) => (
            <div className="cart-item d-flex align-items-center mb-3 p-3 border rounded" key={item._id || item.foodItem}>
              <img
                src={item.image?.[0]?.url || item.images?.[0]?.url || "/images/placeholder.png"}
                alt={item.name}
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                className="me-3"
              />
              <div className="flex-grow-1">
                <h5>{item.name}</h5>
                <p>
                  <FontAwesomeIcon icon={faDollarSign} size="xs" />
                  {item.price} x {item.quantity}
                </p>
              </div>
              <p>
                <FontAwesomeIcon icon={faDollarSign} size="xs" />
                {item.price * item.quantity}
              </p>
            </div>
          ))}

          <h4>Order Summary</h4>
          <div className="card p-3 mb-4">
            <p>
              Order Status:{" "}
              <span
                className={
                  order.orderStatus === "Delivered"
                    ? "badge bg-success"
                    : "badge bg-warning"
                }
              >
                {order.orderStatus}
              </span>
            </p>
            <p><strong>Items Total:</strong> <FontAwesomeIcon icon={faDollarSign} size="xs" />{order.itemsPrice}</p>
            <p><strong>Delivery Charges:</strong> <FontAwesomeIcon icon={faDollarSign} size="xs" />{order.deliveryCharges || 0}</p>
            <hr />
            <p><strong>Total:</strong> <FontAwesomeIcon icon={faDollarSign} size="xs" />{order.totalPrice}</p>
          </div>
        </div>
      ) : (
        <Message variant="info">Order not found.</Message>
      )}
    </div>
  );
};

export default OrderDetails;
