import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import Search from "./Search";
import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cartItem } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const cartCount = cartItem?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const showSearch = location.pathname === "/" || location.pathname.startsWith("/eats/stores/search/");

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar row sticky-top">
        <div className="col-12 col-md-3">
          <Link to="/">
            <img src="/images/logo.webp" alt="logo" className="logo" />
          </Link>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {showSearch && <Search />}
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center d-flex align-items-center justify-content-end gap-3">
          <Link to="/cart" style={{ textDecoration: "none" }} className="position-relative">
            <span className="ml-3" id="cart">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartCount}
            </span>
          </Link>

          <Link to="/ai/recipe" className="btn btn-sm text-white" style={{ backgroundColor: "#078347", borderRadius: "20px", padding: "4px 14px", fontSize: "0.85rem", textDecoration: "none" }}>
            AI Recipe
          </Link>

          {isAuthenticated && user ? (
            <div className="dropdown d-inline-block" style={{ cursor: "pointer" }}>
              <div
                className="d-flex align-items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                data-bs-toggle="dropdown"
              >
                <img
                  src={user.avatar?.url || "/images/default_avatar.png"}
                  alt={user.name}
                  className="rounded-circle"
                  style={{ width: "35px", height: "35px", objectFit: "cover" }}
                />
                <span className="ms-1 material-symbols-outlined">arrow_drop_down</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ right: 0, left: "auto" }}>
                  <Link to="/me" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    My Orders
                  </Link>
                  <Link to="/ai/recipe" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    AI Recipe
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="material-symbols-outlined web_logo">
              account_circle
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;