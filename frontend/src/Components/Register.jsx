import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/actions/userActions";
import Message from "./Message";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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
    dispatch(registerUser({ name, email, password, passwordConfirm, phoneNumber }));
  };

  return (
    <div className="wrapper">
      <div className="row justify-content-center w-100 mx-0">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          {error && <Message variant="danger">{error}</Message>}
          <div className="card border-0 shadow" style={{ borderRadius: '16px' }}>
            <div className="card-body p-5">
              <h2 className="text-center mb-4" style={{ color: '#078347', fontWeight: 700, fontSize: '2rem' }}>Create Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name_field" className="form-label" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Full Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control form-control-lg"
                    placeholder="Enter your full name"
                    style={{ padding: '14px 16px', fontSize: '1.1rem', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                  <label htmlFor="phone_field" className="form-label" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Phone Number</label>
                  <input
                    type="tel"
                    id="phone_field"
                    className="form-control form-control-lg"
                    placeholder="Enter your phone number"
                    style={{ padding: '14px 16px', fontSize: '1.1rem', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password_field" className="form-label" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control form-control-lg"
                    placeholder="Create a password (min 8 chars)"
                    style={{ padding: '14px 16px', fontSize: '1.1rem', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="passwordConfirm_field" className="form-label" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Confirm Password</label>
                  <input
                    type="password"
                    id="passwordConfirm_field"
                    className="form-control form-control-lg"
                    placeholder="Confirm your password"
                    style={{ padding: '14px 16px', fontSize: '1.1rem', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-lg w-100 mt-2"
                  disabled={loading}
                  style={{ backgroundColor: '#078347', border: 'none', color: '#fff', borderRadius: '10px', padding: '14px', fontSize: '1.2rem', fontWeight: 600 }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
                <p className="text-center mt-4 mb-0" style={{ color: '#6c757d', fontSize: '1rem' }}>
                  Already have an account? <Link to="/login" style={{ color: '#078347', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
