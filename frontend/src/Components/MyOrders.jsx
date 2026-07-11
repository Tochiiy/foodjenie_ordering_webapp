import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../redux/actions/orderActions";
import Loader from "./layout/Loader";
import Message from "./Message";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message variant="info">No orders found.</Message>
      ) : (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.orderItems?.length || 0}</td>
                <td>${order.totalPrice || 0}</td>
                <td>
                  <span
                    className={
                      order.orderStatus === "Delivered"
                        ? "badge bg-success"
                        : "badge bg-warning"
                    }
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <Link to={`/order/${order._id}`} className="btn btn-primary btn-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
