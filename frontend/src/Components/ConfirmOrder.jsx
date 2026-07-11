import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { cartItem, resturant, deliveryInfo } = useSelector((state) => state.cart);

  const subtotal = cartItem.reduce(
    (acc, item) => acc + item.foodItem.price * item.quantity,
    0
  );
  const deliveryCharges = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharges;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 col-lg-8">
          <h4>Shipping Info</h4>
          <div className="card p-3 mb-4">
            <p><strong>Address:</strong> {deliveryInfo.address}</p>
            <p><strong>City:</strong> {deliveryInfo.city}</p>
            <p><strong>Postal Code:</strong> {deliveryInfo.postalCode}</p>
            <p><strong>Phone:</strong> {deliveryInfo.phone}</p>
          </div>

          <h4>Cart Items</h4>
          {cartItem.map((item) => (
            <div className="cart-item d-flex align-items-center mb-3 p-3 border rounded" key={item.foodItem._id}>
              <img
                src={item.foodItem.images?.[0]?.url || "/images/placeholder.png"}
                alt={item.foodItem.name}
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                className="me-3"
              />
              <div className="flex-grow-1">
                <h5>{item.foodItem.name}</h5>
                <p>
                  <FontAwesomeIcon icon={faDollarSign} size="xs" />
                  {item.foodItem.price} x {item.quantity}
                </p>
              </div>
              <p>
                <FontAwesomeIcon icon={faDollarSign} size="xs" />
                {item.foodItem.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-3">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Items Total: <span><FontAwesomeIcon icon={faDollarSign} size="xs" />{subtotal}</span>
            </p>
            <p>
              Delivery Charges: <span><FontAwesomeIcon icon={faDollarSign} size="xs" />{deliveryCharges}</span>
            </p>
            <hr />
            <p>
              <strong>Total:</strong> <span><FontAwesomeIcon icon={faDollarSign} size="xs" />{total}</span>
            </p>
            <hr />
            <button className="btn btn-primary w-100" onClick={() => navigate("/payment")}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
