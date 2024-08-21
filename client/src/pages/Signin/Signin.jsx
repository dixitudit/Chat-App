import React from "react";
import "./Signin.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/userSlice";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.unameOrEmail === "" || formData.password === "") {
      setError("Please fill all the fields");
      return;
    }
    try {
      dispatch(signInStart());
      const response = await fetch(`${config.API_URL}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("User signed in successfully");
        dispatch(signInSuccess(data.user));
        navigate("/chats");
      } else {
        setError(data.message);
        dispatch(signInFailure(data.message));
        console.log(error);
      }
    } catch (err) {
      console.log(err);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="some">
      <div className="container">
        <img src="/bot.png" alt="" className="bot" />
        <h1>Sign In</h1>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label className="label">
          <div>Username or Email:</div>

          <input
            type="text"
            className="input"
            name="unameOrEmail"
            id="unameOrEmail"
            placeholder="Username or Email"
            onChange={handleChange}
          />
        </label>
        <label className="label">
          <div>Password:</div>

          <input
            type="password"
            className="input"
            name="password"
            id="password"
            placeholder="********"
            onChange={handleChange}
          />
        </label>
        <div className="center">
          <button type="submit" className="submit-button">
            Sign in
          </button>
          {error && <p className="Error">{error}</p>}
        </div>
        <div className="sign-up-container">
          <p>Don&apos;t have an account?</p>
          <Link to="/signup" className="sign-up-link">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
