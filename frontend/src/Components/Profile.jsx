import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "./layout/Loader";
import { loadUser, deleteUser } from "../redux/actions/userActions";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This action is permanent and will delete all your data.")) {
      dispatch(deleteUser());
      toast.success("Account deleted successfully");
      navigate("/");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="avatar-profile text-center">
              <img
                className="rounded-circle img-fluid"
                src={user?.avatar?.url || "/images/default_avatar.png"}
                alt={user?.name}
              />
              <h4 className="mt-3">{user?.name}</h4>
            </div>
          </div>
          <div className="col-12 col-lg-8 user-info">
            <h3 className="mb-4">Profile Info</h3>
            <div className="mb-3">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phoneNumber}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p>
                <strong>Member Since:</strong>{" "}
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/me/update" className="btn btn-primary">
                Edit Profile
              </Link>
              <Link to="/orders" className="btn btn-outline-primary">
                My Orders
              </Link>
              <Link to="/password/forgot" className="btn btn-outline-secondary">
                Change Password
              </Link>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
