import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart, updateCartItemQuantity } from "../redux/actions/cartActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItem, resturant } = useSelector((state) => state.cart);

  const getRestaurantId = () => resturant?._id || resturant;

  const increaseQty = (foodItem) => {
    const cartIdx = cartItem.findIndex((ci) => ci.foodItem._id === foodItem._id);
    const currentQty = cartIdx >= 0 ? cartItem[cartIdx].quantity : 0;
    if (foodItem.stock > currentQty) {
      dispatch(
        addToCart({
          foodItemId: foodItem._id,
          quantity: 1,
          restaurantId: getRestaurantId(),
        })
      );
    }
  };

  const decreaseQty = (foodItem) => {
    const cartIdx = cartItem.findIndex((ci) => ci.foodItem._id === foodItem._id);
    const currentQty = cartIdx >= 0 ? cartItem[cartIdx].quantity : 0;
    if (currentQty > 1) {
      dispatch(updateCartItemQuantity(foodItem._id, currentQty - 1));
    }
  };

  const removeCartItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const clearCartHandler = () => {
    const id = getRestaurantId();
    if (id) {
      dispatch(clearCart(id));
    }
  };

  const subtotal = cartItem.reduce(
    (acc, item) => acc + item.foodItem.price * item.quantity,
    0
  );
  const deliveryCharges = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharges;

  return (
    <div className="cartt container mt-4">
      {cartItem.length === 0 ? (
        <div className="text-center my-5">
          <h2>Your Cart is Empty</h2>
          <Link to="/" className="btn btn-primary mt-3">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-lg-8">
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
                  <p id="card_item_price">
                    <FontAwesomeIcon icon={faDollarSign} size="xs" />
                    {item.foodItem.price}
                  </p>
                </div>
                <div className="stockCounter d-flex align-items-center me-3">
                  <button className="btn btn-danger" onClick={() => decreaseQty(item.foodItem)}>-</button>
                  <input
                    type="number"
                    className="form-control text-center mx-2"
                    value={item.quantity}
                    readOnly
                    style={{ width: "60px" }}
                  />
                  <button className="btn btn-primary" onClick={() => increaseQty(item.foodItem)}>+</button>
                </div>
                <button
                  id="delete_cart_item"
                  className="btn btn-danger"
                  onClick={() => removeCartItem(item.foodItem._id)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button id="cart_btn" className="btn btn-danger mt-2" onClick={clearCartHandler}>
              Clear Cart
            </button>
          </div>
          <div className="col-12 col-lg-4">
            <div id="order_summary" className="card p-3">
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
              <button id="checkout_btn" className="btn btn-primary w-100" onClick={() => navigate("/shipping")}>
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
