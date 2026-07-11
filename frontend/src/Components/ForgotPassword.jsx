import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="wrapper">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <form className="shadow-sm p-4" onSubmit={handleSubmit}>
            <h3 className="mb-4 text-center">Forgot Password</h3>
            <div className="mb-3">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-block btn-primary w-100">
              Send Email
            </button>
            <p className="mt-3 text-center">
              Remember your password? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
