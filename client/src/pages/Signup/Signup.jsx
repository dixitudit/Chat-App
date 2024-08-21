import React from "react";
import "./Signup.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FcCheckmark } from "react-icons/fc";
import { RxCrossCircled } from "react-icons/rx";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/userSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [otpSend, setOtpSend] = useState(null);
  const [check, setCheck] = useState(null);
  const [otpLoad, setOtpLoad] = useState(false);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    if (e.target.id === "username") {
      setCheck(null);
    }
    if (e.target.id === "email") {
      setOtpSend(null);
    }
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!formData.username || formData.username === "") {
      setError("Please fill the username field");
      return;
    }
    if (formData.username.length < 4) {
      setError("Username should be atleast 4 characters long");
      return;
    }
    try {
      setError(null);
      const response = await fetch(
        `http://localhost:5000/auth/check/${formData.username}`
      );
      const data = await response.json();
      if (response.ok) {
        setCheck(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email || formData.email === "") {
      setError("Please fill the email field");
      return;
    }
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email");
      return;
    }
    try {
      setOtpLoad(true);
      setError(null);
      const response = await fetch("http://localhost:5000/auth/sendotp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSend(data.success);
      } else {
        setOtpSend(data.success);
        setError(data.message);
      }
      setOtpLoad(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.unameOrEmail === "" || formData.password === "") {
      setError("Please fill all the fields");
      return;
    }

    try {
      dispatch(signInStart());
      const response = await fetch("http://localhost:5000/auth/signup", {
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
        <h1>Sign Up</h1>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label className="label">
          <div>Username:</div>
          <div className="input">
            <input
              type="text"
              name="username"
              className="inner-input"
              id="username"
              placeholder="Username"
              onChange={handleChange}
            />
            {!check && (
              <input
                type="button"
                value="Check"
                className="btn"
                onClick={handleCheck}
              />
            )}
            {check === "true" && <FcCheckmark />}
            {check === "false" && <RxCrossCircled />}
          </div>
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
        <label className="label">
          <div>Name:</div>

          <input
            type="text"
            className="input"
            name="name"
            id="name"
            placeholder="John Doe"
            onChange={handleChange}
          />
        </label>
        <label className="label">
          <div>Email:</div>

          <div className="input">
            <input
              type="email"
              className="inner-input"
              name="email"
              id="email"
              placeholder="johndoe@example.com"
              onChange={handleChange}
            />
            {otpSend === null && (
              <input
                type="button"
                value="Send OTP"
                disabled={otpLoad}
                className="btn"
                onClick={handleSendOtp}
              />
            )}
            {otpSend === true && <FcCheckmark />}
            {otpSend === false && <RxCrossCircled />}
          </div>
        </label>
        <label className="label">
          <div>Otp:</div>

          <input
            type="number"
            className={`input ${otpSend === null || !otpSend ? "otp" : ""}`}
            disabled={otpSend === null || !otpSend}
            name="otp"
            id="otp"
            onChange={handleChange}
          />
        </label>
        <div className="center">
          <button type="submit" className="button">
            Sign up
          </button>
          {error && <p className="Error">{error}</p>}
        </div>
        <div className="sign-up-container">
          <p>Already have an account?</p>
          <Link to="/signin" className="sign-up-link">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
