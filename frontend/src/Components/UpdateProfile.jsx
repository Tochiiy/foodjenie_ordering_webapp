import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, loadUser } from "../redux/actions/userActions";
import { updateReset } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import Message from "./Message";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, isUpdated, error } = useSelector((state) => state.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "/images/default_avatar.png");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (isUpdated) {
      dispatch(loadUser());
      dispatch(updateReset());
      toast.success("Profile updated successfully");
      navigate("/me");
    }
  }, [isUpdated, dispatch, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("phoneNumber", phoneNumber);
    if (avatar) {
      formData.set("avatar", avatar);
    }
    dispatch(updateProfile(formData));
  };

  return (
    <div className="wrapper">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {error && <Message variant="danger">{error}</Message>}
          <form className="shadow-sm p-4" onSubmit={handleSubmit}>
            <h3 className="mb-4 text-center">Update Profile</h3>
            <div className="mb-3 text-center">
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="rounded-circle img-fluid"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="avatar_upload">Avatar</label>
              <input
                type="file"
                id="avatar_upload"
                className="form-control"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-3">
              <label htmlFor="phone_field">Phone Number</label>
              <input
                type="tel"
                id="phone_field"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-block btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
