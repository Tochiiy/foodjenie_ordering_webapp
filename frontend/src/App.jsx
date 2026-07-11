import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadUser } from "./redux/actions/userActions";
import Home from "./Components/Home";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Menu from "./Components/Menu";
import Cart from "./Components/Cart";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import UpdateProfile from "./Components/UpdateProfile";
import Shipping from "./Components/Shipping";
import ConfirmOrder from "./Components/ConfirmOrder";
import Payment from "./Components/Payment";
import OrderSuccess from "./Components/OrderSuccess";
import MyOrders from "./Components/MyOrders";
import OrderDetails from "./Components/OrderDetails";
import ForgotPassword from "./Components/ForgotPassword";
import RecipeGenerator from "./Components/RecipeGenerator";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <>
      <ToastContainer />
      <Router>
        <div className="App">
          <Header />
          <div className="container-fluid px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/eats/stores/search/:keyword" element={<Home />} />
              <Route path="/eats/stores/:id/menus" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/me" element={<Profile />} />
              <Route path="/me/update" element={<UpdateProfile />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/order/confirm" element={<ConfirmOrder />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/success" element={<OrderSuccess />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route path="/ai/recipe" element={<RecipeGenerator />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
