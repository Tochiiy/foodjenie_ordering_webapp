import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveDeliveryInfo } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deliveryInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(deliveryInfo.address || "");
  const [city, setCity] = useState(deliveryInfo.city || "");
  const [postalCode, setPostalCode] = useState(deliveryInfo.postalCode || "");
  const [phone, setPhone] = useState(deliveryInfo.phone || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address || !city || !postalCode || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(saveDeliveryInfo({ address, city, postalCode, phone }));
    navigate("/order/confirm");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="card border-0 shadow-lg" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="mb-3" style={{ fontSize: "2.5rem", color: "#078347" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V3a2 2 0 0 1 2-2z"/>
                    <path d="M8 7V3a1 1 0 0 1 1-1h.5a.5.5 0 0 0 0-1H8a2 2 0 0 0-2 2v4H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H8z"/>
                  </svg>
                </div>
                <h3 className="fw-bold" style={{ color: "#1a1a2e" }}>Delivery Address</h3>
                <p className="text-muted">Enter your delivery details below</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="address_field" className="form-label fw-semibold">Street Address</label>
                  <input
                    type="text"
                    id="address_field"
                    className="form-control form-control-lg"
                    placeholder="123 Main Street, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    style={{ borderRadius: "10px", padding: "12px 16px" }}
                  />
                </div>

                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="city_field" className="form-label fw-semibold">City</label>
                    <input
                      type="text"
                      id="city_field"
                      className="form-control form-control-lg"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      style={{ borderRadius: "10px", padding: "12px 16px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="postalCode_field" className="form-label fw-semibold">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode_field"
                      className="form-control form-control-lg"
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      style={{ borderRadius: "10px", padding: "12px 16px" }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="phone_field" className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_field"
                    className="form-control form-control-lg"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ borderRadius: "10px", padding: "12px 16px" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-lg w-100 text-white fw-semibold border-0"
                  style={{ backgroundColor: "#078347", borderRadius: "10px", padding: "14px" }}
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
