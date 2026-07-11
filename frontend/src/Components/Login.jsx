import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
import Message from "./Message";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };

  return (
    <div className="wrapper">
      <div className="row justify-content-center w-100 mx-0">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          {error && <Message variant="danger">{error}</Message>}
          <div className="card border-0 shadow" style={{ borderRadius: '16px' }}>
            <div className="card-body p-5">
              <h2 className="text-center mb-4" style={{ color: '#078347', fontWeight: 700, fontSize: '2rem' }}>Welcome Back</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email_field" className="form-label" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    style={{ padding: '14px 16px', fontSize: '1.1rem', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password_field" className="form-label" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    style={{ padding: '14px 16px', fontSize: '1.1rem', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-lg w-100 mt-2"
                  disabled={loading}
                  style={{ backgroundColor: '#078347', border: 'none', color: '#fff', borderRadius: '10px', padding: '14px', fontSize: '1.2rem', fontWeight: 600 }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <div className="text-center mt-4">
                  <Link to="/password/forgot" style={{ color: '#078347', fontSize: '1rem' }}>Forgot Password?</Link>
                </div>
                <p className="text-center mt-4 mb-0" style={{ color: '#6c757d', fontSize: '1rem' }}>
                  Don't have an account? <Link to="/register" style={{ color: '#078347', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
